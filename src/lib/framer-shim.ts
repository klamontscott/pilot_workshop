// Local shim for the "framer" package (only available in the Framer editor).
// Vite resolves "framer" → this file via the alias in vite.config.ts.

export function addPropertyControls(_component: any, _controls: any) {}

export const ControlType = {
  Color: "color" as const,
  String: "string" as const,
  Number: "number" as const,
  Boolean: "boolean" as const,
  Enum: "enum" as const,
  File: "file" as const,
  Image: "image" as const,
  Array: "array" as const,
  Object: "object" as const,
}
