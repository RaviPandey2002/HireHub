import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    alias: {
      "@/components": path.resolve(__dirname, "./src/app/components"),
      "auth": path.resolve(__dirname, "./auth"),
      "lib": path.resolve(__dirname, "./lib"),
      "schema": path.resolve(__dirname, "./schema"),
      "types": path.resolve(__dirname, "./types"),
      "actions": path.resolve(__dirname, "./actions"),
    },
  },
});

