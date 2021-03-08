import { ScoreEngine } from "../ScoreEngine";

describe("test error for ScoreEngine module", () => {
  it("should not execute a program if compilation failed", () => {
    const input = `var a = .`;

    const scoreEngine = new ScoreEngine(input);
    expect(scoreEngine.execute()).toBe(false);
    scoreEngine.compile();
    expect(scoreEngine.execute()).toBe(false);
  });

  it("should throw error when the code has syntax error", () => {
    const input = `var a = .`;

    const scoreEngine = new ScoreEngine(input);
    expect(scoreEngine.compile()).toBe(false);
    expect(scoreEngine.getErrors().length).toBe(1);
  });
});

describe("test ScoreEngine module", () => {
  it("should compile before execute a program", () => {
    const input = `var a = 10`;

    const scoreEngine = new ScoreEngine(input);
    expect(scoreEngine.execute()).toBe(false);
    scoreEngine.compile();
    expect(scoreEngine.execute()).toBe(true);
  });

  it("should compile Score language to JS correctly", () => {
    const input = `var a = 10`;

    const scoreEngine = new ScoreEngine(input);
    expect(scoreEngine.compile()).toBe(true);
  });
});
