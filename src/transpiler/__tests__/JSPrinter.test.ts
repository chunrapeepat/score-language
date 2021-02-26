import { JSPrinter } from "../JSPrinter";
import { Parser } from "../Parser";
import { Scanner } from "../Scanner";

describe("translate the language to Javascript", () => {
  test("logical operator should translate to JS correctly", () => {
    const input = `
      !(1 <= 10) == true
      not (10 == 10) == false
    `;
    const expectedOutput = `!(1 <= 10) == true;!(10 == 10) == false;`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  test("mathematical expression should translate to JS correctly", () => {
    const input = `
      (1 + 2) * 3 / 10
      5 * 4 * 3
      -10
    `;
    const expectedOutput = `(1 + 2) * 3 / 10;5 * 4 * 3;-10;`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });
});
