#!/usr/bin/env node

import { HtmlValidate } from "html-validate";
import { glob } from "glob";
import { resolve, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

/**
 * Transform Astro files to valid HTML for validation
 */
function astroTransform(source) {
  let content = source;

  // 1. Remove frontmatter completely (everything between --- at start)
  content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/m, (match) => {
    // Replace with blank lines to preserve line numbers
    return "\n".repeat((match.match(/\n/g) || []).length);
  });

  // 2. Remove code blocks (backticks) - these often contain HTML-like syntax
  content = content.replace(/```[\s\S]*?```/g, (match) => {
    return "\n".repeat((match.match(/\n/g) || []).length);
  });

  // 3. Don't replace backticks - they're handled by attribute expression replacement
  // (Removing this step as it breaks template literals in attributes)

  // 4. Remove complex JSX expressions with .map, =>, &&, ||, etc.
  content = removeComplexJSX(content);

  // 5. Replace class:list with proper brace matching (it can have nested arrays/objects)
  content = replaceClassList(content);

  // 6. Replace other Astro directives
  content = content.replace(/\s+set:html=\{[^}]+\}/g, "");
  content = content.replace(/\s+set:text=\{[^}]+\}/g, "");
  content = content.replace(/\s+client:\w+(?:=\{[^}]+\})?/g, "");
  content = content.replace(/\s+transition:\w+(?:=\{[^}]+\})?/g, "");

  // 7. Replace attribute expressions
  content = replaceAttributeExpressions(content);

  // 7. Handle Fragment
  content = content.replace(/<Fragment[^>]*>/g, "<div>");
  content = content.replace(/<\/Fragment>/g, "</div>");

  // 8. Replace Astro components with divs
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)\s+[^>]*?\/>/g, '<div data-component="$1"></div>');
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)\/>/g, '<div data-component="$1"></div>');
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)\s+[^>]*>/g, '<div data-component="$1">');
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)>/g, '<div data-component="$1">');
  content = content.replace(/<\/([A-Z][a-zA-Z0-9]*)>/g, "</div>");

  // 9. Handle slots - replace with comments to avoid false positives in content validation
  content = content.replace(/<slot\s+[^>]*?\/>/g, "<!-- slot -->");
  content = content.replace(/<slot\/>/g, "<!-- slot -->");
  content = content.replace(/<slot\s+[^>]*>/g, "<!-- slot -->");
  content = content.replace(/<slot>/g, "<!-- slot -->");
  content = content.replace(/<\/slot>/g, "<!-- /slot -->");

  // 10. Remove remaining simple JSX expressions
  content = content.replace(/>\s*\{[^}<>]+\}\s*</g, ">CONTENT<");
  content = content.replace(/\{[^}<>]+\}/g, "PLACEHOLDER");

  return content;
}

/**
 * Check for common HTML structure issues that transformation might hide
 */
function checkStructuralIssues(source, filePath) {
  const issues = [];
  const lines = source.split("\n");

  // Check for <div> directly inside <button> or <span>
  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // Check if we're inside a <button> tag by looking at context
    if (line.includes("<div") && !line.includes("slot=")) {
      // Look back to see if we're in a button
      let inButton = false;
      let inSpan = false;
      let depth = 0;

      for (let i = index; i >= 0 && i > index - 20; i--) {
        const prevLine = lines[i];
        if (prevLine.match(/<button\b[^>]*>/)) {
          // Check if button is closed before our div
          const buttonClose = lines
            .slice(i, index)
            .join("\n")
            .match(/<\/button>/);
          if (!buttonClose) {
            inButton = true;
            break;
          }
        }
        if (prevLine.match(/<span\b[^>]*>/)) {
          const spanClose = lines
            .slice(i, index)
            .join("\n")
            .match(/<\/span>/);
          if (!spanClose && lines[i].includes("class=")) {
            inSpan = true;
            break;
          }
        }
      }

      if (inButton) {
        issues.push({
          line: lineNum,
          column: line.indexOf("<div") + 1,
          message: "<div> element should not be used inside <button>. Use <span> instead for styling.",
          severity: 2,
          ruleId: "no-div-in-button",
        });
      }
    }
  });

  return issues;
}

/**
 * Replace class:list attributes with placeholders
 */
function replaceClassList(text) {
  let result = "";
  let i = 0;

  while (i < text.length) {
    const remaining = text.substring(i);
    const match = remaining.match(/\s+class:list=\{/);

    if (match && remaining.startsWith(match[0])) {
      result += " class=";
      i += match[0].length;

      // Find matching closing brace
      let depth = 1;
      let inString = null;

      while (i < text.length && depth > 0) {
        const char = text[i];

        if (!inString && (char === '"' || char === "'" || char === "`")) {
          inString = char;
        } else if (inString && char === inString && text[i - 1] !== "\\") {
          inString = null;
        } else if (!inString) {
          if (char === "{" || char === "[") depth++;
          else if (char === "}" || char === "]") depth--;
        }

        i++;
      }

      result += '"placeholder"';
    } else {
      result += text[i];
      i++;
    }
  }

  return result;
}

/**
 * Remove complex JSX blocks that contain maps, arrows, logical operators, etc.
 */
function removeComplexJSX(text) {
  let result = "";
  let i = 0;

  while (i < text.length) {
    if (text[i] === "{") {
      let depth = 1;
      let start = i;
      i++;

      let inString = null;
      let escaped = false;

      while (i < text.length && depth > 0) {
        const char = text[i];

        if (escaped) {
          escaped = false;
          i++;
          continue;
        }

        if (char === "\\") {
          escaped = true;
          i++;
          continue;
        }

        if (inString === null && (char === '"' || char === "'" || char === "`")) {
          inString = char;
          i++;
          continue;
        }

        if (inString !== null && char === inString) {
          inString = null;
          i++;
          continue;
        }

        if (inString === null) {
          if (char === "{") depth++;
          else if (char === "}") depth--;
        }

        i++;
      }

      const matched = text.substring(start, i);

      // Check if this is a complex JSX expression
      if (
        matched.includes(".map(") ||
        matched.includes("=>") ||
        matched.includes("&&") ||
        matched.includes("||") ||
        matched.includes("\n")
      ) {
        // Replace with a placeholder that maintains line count
        const lineCount = (matched.match(/\n/g) || []).length;
        result += "\n".repeat(lineCount) + "CONTENT";
      } else {
        result += matched;
      }
    } else {
      result += text[i];
      i++;
    }
  }

  return result;
}

/**
 * Replace attribute expressions with placeholders
 */
function replaceAttributeExpressions(text) {
  let result = "";
  let i = 0;

  while (i < text.length) {
    const remaining = text.substring(i);
    const attrMatch = remaining.match(/^(\s+)([\w:-]+)=\{/);

    if (attrMatch) {
      const attrName = attrMatch[2];
      result += attrMatch[1];
      i += attrMatch[0].length;

      let depth = 1;
      let inString = null;

      while (i < text.length && depth > 0) {
        const char = text[i];

        if (!inString && (char === '"' || char === "'" || char === "`")) {
          inString = char;
        } else if (inString && char === inString) {
          inString = null;
        } else if (!inString) {
          if (char === "{") depth++;
          else if (char === "}") depth--;
        }

        i++;
      }

      result += `${attrName}="placeholder"`;
    } else {
      result += text[i];
      i++;
    }
  }

  return result;
}

// Initialize validator
const htmlvalidate = new HtmlValidate({
  extends: ["html-validate:recommended"],
  rules: {
    "void-style": "off",
    "no-trailing-whitespace": "off",
    deprecated: "warn", // Change to warning for testing
    "attr-quotes": ["error", { style: "double", unquoted: false }],
    "element-required-attributes": "error",
    "no-inline-style": "off",
    "require-sri": "off",
    "wcag/h30": "off",
    "wcag/h32": "off",
    "wcag/h37": "off",
    "attribute-boolean-style": "off",
    "no-implicit-close": "error",
    "no-unknown-attribute": "warn",
    "no-implicit-button-type": "error",
    "element-permitted-content": "error", // Enabled - we filter false positives from transformed components
    "no-raw-characters": "off", // Astro expressions can have > in them
    "tel-non-breaking": "off", // Not critical for demo content
    "attr-spacing": "off", // Can have issues after transformation
    "attr-case": "off", // Can have issues after transformation
    "close-order": "off", // Can have issues with JSX fragments
    "no-dup-id": "off", // Placeholders can create duplicate IDs
    "attribute-allowed-values": "off", // Placeholders don't have valid values
    "no-self-closing": "off", // JSX allows self-closing tags
    "prefer-native-element": "off", // Astro uses divs for components
    "parser-error": "off", // Transformation can create parser issues with complex expressions
    "attr-quotes": "off", // Can have issues with quotes in code strings
    "input-attributes": "off", // Placeholders can create invalid attributes
    "attr-delimiter": "off", // JSON in attributes can cause issues
  },
});

async function getFilesToValidate() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const astroFiles = await glob("src/**/*.astro", { cwd: rootDir });
    return astroFiles.map((f) => resolve(rootDir, f));
  }

  const files = [];
  for (const arg of args) {
    const pattern = arg.includes("*") || !arg.includes(".") ? `${arg}/**/*.astro` : arg;
    const matched = await glob(pattern, { cwd: rootDir });
    files.push(...matched.map((f) => resolve(rootDir, f)));
  }

  return files;
}

function formatResults(report, filePath) {
  const relativePath = relative(rootDir, filePath);

  const results = report.results || [];

  // Recalculate error/warning counts from filtered messages
  const allMessages = [];
  for (const result of results) {
    if (result.messages) {
      allMessages.push(...result.messages);
    }
  }

  const errorCount = allMessages.filter((m) => m.severity === 2 && m.line).length;
  const warningCount = allMessages.filter((m) => m.severity === 1 && m.line).length;
  const valid = errorCount === 0 && warningCount === 0;

  if (valid) {
    console.log(`${colors.green}✓${colors.reset} ${colors.gray}${relativePath}${colors.reset}`);
    return { errors: 0, warnings: 0 };
  }

  console.log(`\n${colors.bright}${relativePath}${colors.reset}`);

  const sortedMessages = allMessages
    .filter((msg) => msg && msg.line)
    .sort((a, b) => {
      if (a.line !== b.line) return a.line - b.line;
      return (a.column || 0) - (b.column || 0);
    });

  for (const msg of sortedMessages) {
    const severity = msg.severity === 2 ? "error" : "warning";
    const color = severity === "error" ? colors.red : colors.yellow;
    const icon = severity === "error" ? "✗" : "⚠";

    console.log(
      `  ${color}${icon}${colors.reset} ` +
        `${colors.gray}line ${msg.line}:${msg.column || 0}${colors.reset} ` +
        `${msg.message} ` +
        `${colors.gray}(${msg.ruleId || "unknown"})${colors.reset}`
    );
  }

  return {
    errors: errorCount,
    warnings: warningCount,
  };
}

async function validate() {
  console.log(`${colors.cyan}${colors.bright}HTML Validation (Astro Files)${colors.reset}\n`);

  const files = await getFilesToValidate();

  if (files.length === 0) {
    console.log(`${colors.yellow}No files found to validate${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.gray}Validating ${files.length} file(s)...${colors.reset}\n`);

  let totalErrors = 0;
  let totalWarnings = 0;
  let validFiles = 0;
  let invalidFiles = 0;

  for (const file of files) {
    try {
      const source = readFileSync(file, "utf-8");

      // Run custom structural checks on source before transformation
      const structuralIssues = checkStructuralIssues(source, file);

      const transformed = astroTransform(source);
      const report = await htmlvalidate.validateString(transformed);

      // Combine html-validate results with custom checks
      const combinedReport = {
        ...report,
        results: report.results.map((result, idx) => {
          // Filter out false positives from transformed components in ALL results
          const filteredMessages = (result.messages || []).filter((msg) => {
            // Keep non-element-permitted-content errors
            if (msg.ruleId !== "element-permitted-content") return true;

            // Filter out errors inside transformed Astro components
            // These show as elements under <div data-component="...">
            if (msg.message && msg.message.includes("element is not permitted as content under <div>")) {
              // Check if the error is inside a transformed component by looking at the line
              const transformedLines = transformed.split("\n");

              // Look backwards to see if we're inside a data-component div
              let depth = 0;
              for (let i = msg.line - 2; i >= Math.max(0, msg.line - 50); i--) {
                const line = transformedLines[i] || "";

                // Count divs to track nesting
                if (line.includes("</div>")) depth++;
                if (line.match(/<div[^>]*>/)) {
                  if (depth > 0) {
                    depth--;
                  } else {
                    // This is the parent div - check if it's a component
                    if (line.includes("data-component=")) {
                      return false; // Inside component, filter out
                    }
                    break; // Found parent, not a component
                  }
                }
              }
            }

            return true;
          });

          // Add custom structural issues only to first result
          const finalMessages = idx === 0 ? [...filteredMessages, ...structuralIssues] : filteredMessages;

          return {
            ...result,
            messages: finalMessages,
          };
        }),
      };

      const { errors, warnings } = formatResults(combinedReport, file);

      if (errors === 0 && warnings === 0) {
        validFiles++;
      } else {
        invalidFiles++;
        totalErrors += errors;
        totalWarnings += warnings;
      }
    } catch (error) {
      console.error(`${colors.red}Error validating ${file}:${colors.reset}`, error.message);
      invalidFiles++;
    }
  }

  console.log(`\n${colors.bright}Summary:${colors.reset}`);
  console.log(`  ${colors.green}✓ ${validFiles} file(s) valid${colors.reset}`);

  if (invalidFiles > 0) {
    console.log(`  ${colors.red}✗ ${invalidFiles} file(s) with issues${colors.reset}`);
    if (totalErrors > 0) {
      console.log(`    ${colors.red}✗ ${totalErrors} error(s) total${colors.reset}`);
    }
    if (totalWarnings > 0) {
      console.log(`    ${colors.yellow}⚠ ${totalWarnings} warning(s) total${colors.reset}`);
    }
  }

  // Exit silently to avoid pnpm error message
  process.exit(totalErrors > 0 ? 1 : 0);
}

validate().catch((error) => {
  console.error(`${colors.red}Validation failed:${colors.reset}`, error);
  process.exit(1);
});
