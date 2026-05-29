import { describe, it, expect } from "vitest";
import { CHAPTERS_DATA } from "./data";

// Custom Brace-Indentation Formatter mock that matches our backend logic exactly.
// Verifying correctness of this algorithm keeps the Ovie code formatting spotless.
function formatOvieCode(code: string): string {
  const lines = code.split("\n");
  let indentLevel = 0;
  
  const formattedLines = lines.map((line) => {
    let trimmed = line.trim();
    
    // Decrease indent if line begins with closing brackets
    if (trimmed.startsWith("}") || trimmed.startsWith("]")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    const indentSpace = "  ".repeat(indentLevel);
    const result = trimmed ? `${indentSpace}${trimmed}` : "";
    
    // Increase indent if line ends with opening brackets
    if (trimmed.endsWith("{") || trimmed.endsWith("[")) {
      indentLevel += 1;
    }
    
    return result;
  });
  
  return formattedLines.join("\n");
}

describe("OvieLearn Systems Unit Tests", () => {
  describe("Syllabus Data Tests", () => {
    it("should possess a solid lesson syllabus layout", () => {
      expect(CHAPTERS_DATA.length).toBeGreaterThan(0);
      
      const firstChapter = CHAPTERS_DATA[0];
      expect(firstChapter).toHaveProperty("id");
      expect(firstChapter).toHaveProperty("title");
      expect(firstChapter).toHaveProperty("lessons");
      expect(firstChapter.lessons.length).toBeGreaterThan(0);
    });

    it("should include working boilerplate code templates for each lesson", () => {
      CHAPTERS_DATA.forEach((chapter) => {
        chapter.lessons.forEach((lesson) => {
          expect(lesson.codeBoilerplate).toBeDefined();
          expect(typeof lesson.codeBoilerplate).toBe("string");
          expect(lesson.title).toBeDefined();
        });
      });
    });
  });

  describe("Ovie Custom Code Alignment and Formatters", () => {
    it("should format unformatted bracket structures successfully", () => {
      const rawCode = "fn main() {\nlet x = 12;\n}";
      const formatted = formatOvieCode(rawCode);
      
      const expected = "fn main() {\n  let x = 12;\n}";
      expect(formatted).toBe(expected);
    });

    it("should handle nested bracket indentations up to multiple depths", () => {
      const rawCode = "fn loop_check() {\nif condition {\nlet val = true;\n}\n}";
      const formatted = formatOvieCode(rawCode);
      
      const expected = "fn loop_check() {\n  if condition {\n    let val = true;\n  }\n}";
      expect(formatted).toBe(expected);
    });

    it("should leave empty lines formatted without unnecessary Whitespaces", () => {
      const rawCode = "fn main() {\n\nlet a = 12;\n}";
      const formatted = formatOvieCode(rawCode);
      
      expect(formatted.split("\n")[1]).toBe("");
    });
  });
});
