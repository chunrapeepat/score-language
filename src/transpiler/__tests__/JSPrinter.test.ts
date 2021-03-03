import { JSPrinter } from "../JSPrinter";
import { Parser } from "../Parser";
import { Scanner } from "../Scanner";

describe("translate the language to Javascript", () => {
  it("should translate exit statement to JS correctly", () => {
    const input = `exit program`;
    const expectedOutput = `this.exitProgram();`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate while loop with break or continue statement correctly", () => {
    const input = `
      while true then
        if a < 10 then
          continue
        else 
          break
        end
      end
    `;
    const expectedOutput = `while (true) {if (_a < 10) {continue;} else {break;}}`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate repeat statement to JS correctly", () => {
    const input = `
      var n = 10
      repeat n times then
        print n
      end
    `;
    const expectedOutput = `let _n = 10;{for (let i = 0; i < _n; ++i) {this.print(_n);}}`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate while statement to JS correctly", () => {
    const input = `
      var a = 10
      while a < 10 then
        print a
        set a = a + 1
      end
    `;
    const expectedOutput = `let _a = 10;while (_a < 10) {this.print(_a);_a = _a + 1;}`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate if-else with else-if statement to JS correctly", () => {
    const input = `
      if a <= 3 then
        print "a is less than or equal to 3"
      else if a >= 0 then
        print "a is greater than 0"
      else
        print "a is less than 0 or greater than 3"
      end
    `;
    const expectedOutput = `if (_a <= 3) {this.print("a is less than or equal to 3");} else if (_a >= 0) {this.print("a is greater than 0");} else {this.print("a is less than 0 or greater than 3");}`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate if-else statement to JS correctly", () => {
    const input = `
      if a <= 3 then
        if a == 2 then
          print "a is 2"
        end
      else
        print "a is greater than 3"
      end
    `;
    const expectedOutput = `if (_a <= 3) {if (_a === 2) {this.print("a is 2");}} else {this.print("a is greater than 3");}`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate if-else statement to JS correctly", () => {
    const input = `
      if a <= 3 then
        print "a is less than or equal to 3"
      else
        print "a is greater than 3"
      end
    `;
    const expectedOutput = `if (_a <= 3) {this.print("a is less than or equal to 3");} else {this.print("a is greater than 3");}`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

  it("should translate if-then-end statement to JS correctly", () => {
    const input = `
      if a <= 3 then
        print "a is less than or equal to 3"
      end
    `;
    const expectedOutput = `if (_a <= 3) {this.print("a is less than or equal to 3");}`;

    const scanner = new Scanner(input);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const printer = new JSPrinter();
    expect(printer.print(parser.parse())).toBe(expectedOutput);
  });

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
    const expectedOutput = `!(1 <= 10) === true;!(10 === 10) === false;`;

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
