// Color data for demo pages - auto-generated from _colors.scss
// DO NOT EDIT MANUALLY - run 'pnpm run colors:sync' to regenerate

export interface ColorGroup {
  name: string;
  displayName: string;
  shades: Array<{
    shade: string;
    value: string;
    className: string;
    cssVar: string;
  }>;
}

export const colorData: ColorGroup[] = [
  {
    "name": "teal",
    "displayName": "Teal",
    "shades": [
      {
        "shade": "50",
        "value": "#a3cccc",
        "className": "ast-bg-teal-50",
        "cssVar": "--teal-50"
      },
      {
        "shade": "100",
        "value": "#76cccc",
        "className": "ast-bg-teal-100",
        "cssVar": "--teal-100"
      },
      {
        "shade": "150",
        "value": "#10afaf",
        "className": "ast-bg-teal-150",
        "cssVar": "--teal-150"
      },
      {
        "shade": "200",
        "value": "#009999",
        "className": "ast-bg-teal-200",
        "cssVar": "--teal-200"
      },
      {
        "shade": "250",
        "value": "#167f8a",
        "className": "ast-bg-teal-250",
        "cssVar": "--teal-250"
      },
      {
        "shade": "300",
        "value": "#006e79",
        "className": "ast-bg-teal-300",
        "cssVar": "--teal-300"
      },
      {
        "shade": "350",
        "value": "#00535c",
        "className": "ast-bg-teal-350",
        "cssVar": "--teal-350"
      },
      {
        "shade": "400",
        "value": "#005057",
        "className": "ast-bg-teal-400",
        "cssVar": "--teal-400"
      },
      {
        "shade": "15050",
        "value": "#76cccc80",
        "className": "ast-bg-teal-150-50",
        "cssVar": "--teal-150-50"
      },
      {
        "shade": "15075",
        "value": "#76ccccbf",
        "className": "ast-bg-teal-150-75",
        "cssVar": "--teal-150-75"
      },
      {
        "shade": "20050",
        "value": "#009999b3",
        "className": "ast-bg-teal-200-50",
        "cssVar": "--teal-200-50"
      }
    ]
  },
  {
    "name": "neutral",
    "displayName": "Neutral",
    "shades": [
      {
        "shade": "0",
        "value": "#ffffff",
        "className": "ast-bg-neutral-0",
        "cssVar": "--neutral-0"
      },
      {
        "shade": "50",
        "value": "#f4f0eb",
        "className": "ast-bg-neutral-50",
        "cssVar": "--neutral-50"
      },
      {
        "shade": "80",
        "value": "#e9e1d7",
        "className": "ast-bg-neutral-80",
        "cssVar": "--neutral-80"
      },
      {
        "shade": "100",
        "value": "#e4dcd3",
        "className": "ast-bg-neutral-100",
        "cssVar": "--neutral-100"
      },
      {
        "shade": "200",
        "value": "#c1b2a5",
        "className": "ast-bg-neutral-200",
        "cssVar": "--neutral-200"
      },
      {
        "shade": "300",
        "value": "#7b6f60",
        "className": "ast-bg-neutral-300",
        "cssVar": "--neutral-300"
      },
      {
        "shade": "400",
        "value": "#615546",
        "className": "ast-bg-neutral-400",
        "cssVar": "--neutral-400"
      },
      {
        "shade": "600",
        "value": "#363639",
        "className": "ast-bg-neutral-600",
        "cssVar": "--neutral-600"
      },
      {
        "shade": "800",
        "value": "#000000",
        "className": "ast-bg-neutral-800",
        "cssVar": "--neutral-800"
      }
    ]
  }
];

// Helper function to get color name with proper capitalization
export function getColorName(colorKey: string): string {
  return colorKey.charAt(0).toUpperCase() + colorKey.slice(1);
}

// Helper function to get all color entries
export function getColorEntries() {
  return colorData;
}
