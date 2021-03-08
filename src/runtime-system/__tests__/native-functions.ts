import { InvalidArgumentError } from "../Error";
import { random } from "../native-functions";

describe("function: random from <from> to <to>", () => {
  it("should be random within specific range correctly", () => {
    const from = 10;
    const to = 20;

    for (let i = 0; i < 100; ++i) {
      const randomNumber = random.fn({ from, to });
      expect(randomNumber).toBeGreaterThanOrEqual(from);
      expect(randomNumber).toBeLessThanOrEqual(to);
    }
  });

  it("should be random within specific range if from > to correctly", () => {
    const from = 50;
    const to = 10;

    for (let i = 0; i < 100; ++i) {
      const randomNumber = random.fn({ from, to });
      expect(randomNumber).toBeGreaterThanOrEqual(to);
      expect(randomNumber).toBeLessThanOrEqual(from);
    }
  });

  it("should throw an error if arguments is not a number", () => {
    const from = "hello" as any;
    const to = 20;

    expect(() => random.fn({ from, to })).toThrow(InvalidArgumentError);
  });
});
