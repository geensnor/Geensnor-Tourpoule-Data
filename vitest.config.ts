import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    forceRerunTriggers: ["**/*.yaml", "**/*.test.ts"],
  },
});
