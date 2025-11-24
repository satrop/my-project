#!/usr/bin/env node

import { mkdir, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function create() {
  const args = process.argv.slice(2);
  const projectName = args[0] || "my-boilerplate-project";
  const targetDir = resolve(process.cwd(), projectName);

  console.log(`\n🚀 Creating AST Boilerplate project in ${targetDir}...\n`);

  // Check if directory already exists
  if (existsSync(targetDir)) {
    console.error(`❌ Error: Directory "${projectName}" already exists.`);
    process.exit(1);
  }

  try {
    // Create target directory
    await mkdir(targetDir, { recursive: true });

    // Copy all files from the package
    const sourceDir = __dirname;
    await cp(sourceDir, targetDir, {
      recursive: true,
      filter: (src) => {
        // Skip node_modules, dist, and other build artifacts
        const relativePath = src.replace(sourceDir, "");
        return !relativePath.match(/(node_modules|dist|build|temp-assets|\.git)$/);
      },
    });

    console.log("✅ Project created successfully!\n");
    console.log("📦 Next steps:\n");
    console.log(`   cd ${projectName}`);
    console.log("   pnpm install");
    console.log("   pnpm dev\n");
  } catch (error) {
    console.error("❌ Error creating project:", error.message);
    process.exit(1);
  }
}

create();
