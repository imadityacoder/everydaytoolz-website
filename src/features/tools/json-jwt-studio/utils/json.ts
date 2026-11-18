export interface JsonErrorInfo {
  message: string;
  line: number;
  column: number;
  position: number | null;
  errorLineText: string;
  pointer: string;
  snippet: {
    lineNum: number;
    text: string;
    isError: boolean;
  }[];
}

export function parseAndFormatJson(
  rawText: string,
  indent: number | string
): { formatted: string; parsed: any; error: JsonErrorInfo | null } {
  if (!rawText.trim()) {
    return { formatted: "", parsed: null, error: null };
  }

  try {
    const parsed = JSON.parse(rawText);
    const formatted = JSON.stringify(parsed, null, indent);
    return { formatted, parsed, error: null };
  } catch (err: any) {
    const error = parseJsonError(rawText, err.message || "Invalid JSON");
    return { formatted: rawText, parsed: null, error };
  }
}

export function minifyJson(rawText: string): { minified: string; error: JsonErrorInfo | null } {
  if (!rawText.trim()) {
    return { minified: "", error: null };
  }

  try {
    const parsed = JSON.parse(rawText);
    const minified = JSON.stringify(parsed);
    return { minified, error: null };
  } catch (err: any) {
    const error = parseJsonError(rawText, err.message || "Invalid JSON");
    return { minified: rawText, error };
  }
}

export function parseJsonError(rawText: string, message: string): JsonErrorInfo {
  let line = 1;
  let column = 1;
  let position: number | null = null;

  // 1. Try to find '(line X column Y)'
  const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  } else {
    // 2. Try to find 'position X'
    const posMatch = message.match(/position\s+(\d+)/i);
    if (posMatch) {
      position = parseInt(posMatch[1], 10);
    }
  }

  if (position !== null && !lineColMatch) {
    const clampedPos = Math.min(position, rawText.length);
    const linesUpTo = rawText.slice(0, clampedPos).split("\n");
    line = linesUpTo.length;
    column = linesUpTo[linesUpTo.length - 1].length + 1;
  }

  const allLines = rawText.split("\n");
  const totalLines = allLines.length;
  const clampedLine = Math.max(1, Math.min(line, totalLines));
  const errorLineText = allLines[clampedLine - 1] ?? "";

  // Make pointer
  const safeCol = Math.max(1, column);
  const pointerSpaces = " ".repeat(Math.min(safeCol - 1, errorLineText.length));
  const pointer = `${pointerSpaces}^`;

  // Build 3-line contextual snippet
  const startLine = Math.max(1, clampedLine - 1);
  const endLine = Math.min(totalLines, clampedLine + 1);
  const snippet = [];

  for (let i = startLine; i <= endLine; i++) {
    snippet.push({
      lineNum: i,
      text: allLines[i - 1] ?? "",
      isError: i === clampedLine,
    });
  }

  return {
    message,
    line: clampedLine,
    column: safeCol,
    position,
    errorLineText,
    pointer,
    snippet,
  };
}

export const JSON_SAMPLE_PRESETS = [
  {
    name: "User Profile (API)",
    json: JSON.stringify(
      {
        id: "usr_998472",
        name: "Aditya Sharma",
        email: "aditya@example.com",
        isActive: true,
        roles: ["admin", "developer", "auditor"],
        preferences: {
          theme: "dark",
          notifications: {
            email: true,
            push: false,
            frequency: "daily",
          },
          locale: "en-US",
        },
        metadata: {
          loginCount: 142,
          lastLoginIp: "192.168.1.104",
          createdTimestamp: 1716384000,
          nullField: null,
        },
      },
      null,
      2
    ),
  },
  {
    name: "E-Commerce Order",
    json: JSON.stringify(
      {
        orderId: "ord_20261118_904",
        status: "PROCESSING",
        currency: "USD",
        totals: {
          subtotal: 129.98,
          tax: 10.4,
          shipping: 0.0,
          grandTotal: 140.38,
        },
        customer: {
          id: 48821,
          email: "customer@company.org",
        },
        items: [
          {
            sku: "TECH-KB-001",
            title: "Ergonomic Mechanical Keyboard",
            qty: 1,
            unitPrice: 99.99,
          },
          {
            sku: "ACC-WRIST-02",
            title: "Memory Foam Wrist Rest",
            qty: 1,
            unitPrice: 29.99,
          },
        ],
        fulfilled: false,
      },
      null,
      2
    ),
  },
  {
    name: "Invalid JSON (Demo Error)",
    json: `{\n  "title": "Syntax Error Showcase",\n  "version": 2.0,\n  "features": [\n    "auto-formatting",\n    "error pointer",\n  ],\n  "trailingComma": true,\n}`,
  },
];
