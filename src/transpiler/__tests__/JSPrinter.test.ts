import { JSPrinter } from "../JSPrinter";
import { Parser } from "../Parser";
import { Scanner } from "../Scanner";

describe("translate the language to Javascript", () => {
  it("should translate play statement to JS correctly", () => {
    const input = `
      play note n * i
      play note 1 for 2 secs
    `;
    const expectedOutput = `await this.playNote(_n * _i, undefined);await this.playNote(1, 2);`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate wait statement to JS correctly", () => {
    const input = `
      wait (10 + 20) * t secs
    `;
    const expectedOutput = `await this.wait((10 + 20) * _t);`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate say statement to JS correctly", () => {
    const input = `
      say (10 + 20) * t
      say name for 2 secs
    `;
    const expectedOutput = `await this.say((10 + 20) * _t, undefined);await this.say(_name, 2);`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate print statement to JS correctly", () => {
    const input = `
      print (10 + 20) * t
    `;
    const expectedOutput = `this.print((10 + 20) * _t);`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate set statement to JS correctly", () => {
    const input = `
      set name = "test"
    `;
    const expectedOutput = `_name = "test";`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate var statement to JS correctly", () => {
    const input = `
      var name = "test"
      var window
    `;
    const expectedOutput = `let _name = "test";let _window = null;`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate logical operator to JS correctly", () => {
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

  it("should translate mathematical expression to JS correctly", () => {
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
