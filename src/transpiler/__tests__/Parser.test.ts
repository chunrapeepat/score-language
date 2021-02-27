import { Binary, Grouping, Literal, Unary } from "../Expr";
import { Parser } from "../Parser";
import { Scanner } from "../Scanner";
import { Expression } from "../Stmt";
import { Token } from "../Token";
import { TokenType } from "../TokenType";
import { SyntaxError } from "../Error";

describe("parse error", () => {
  it("should detect multiple errors", () => {
    const input = `!-+\n\n(10\n\n+`;

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(() => parser.parse()).toThrow(Error);
    expect(parser.getErrors().length).toBe(3);
  });

  it("should detect invalid mathematical expression", () => {
    const input = `!-+`;

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(() => parser.parse()).toThrow(Error);
    expect(parser.getErrors().length).toBe(1);
    expect(parser.getErrors()[0]).toBeInstanceOf(SyntaxError);
  });

  test("open-paren must be followed by close-paren within the same line", () => {
    const input = `(10 + 20`;

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(() => parser.parse()).toThrow(Error);
    expect(parser.getErrors().length).toBe(1);
    expect(parser.getErrors()[0]).toBeInstanceOf(SyntaxError);
  });
});

describe("parse statements", () => {
  it("should skip new-line statement", () => {
    const input = `10\n\n\n\n\n20`;
    const expectedOutput = [
      new Expression(new Literal(10)),
      new Expression(new Literal(20)),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });
});

describe("parse expression statement", () => {
  test("unary operator should have associativity from right to left", () => {
    const input = `!!!true`;
    const expectedOutput = [
      new Expression(
        new Unary(
          new Token(TokenType.NOT, "!", null, 1),
          new Unary(
            new Token(TokenType.NOT, "!", null, 1),
            new Unary(new Token(TokenType.NOT, "!", null, 1), new Literal(true))
          )
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("grouping should have higher precedence than binary and unary operators", () => {
    const input = `10 / -(10 + 10)`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal(10),
          new Token(TokenType.SLASH, "/", null, 1),
          new Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Grouping(
              new Binary(
                new Literal(10),
                new Token(TokenType.PLUS, "+", null, 1),
                new Literal(10)
              )
            )
          )
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("unary operator shoud parse correctly with binary operator", () => {
    const input = `10 + -10`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal(10),
          new Token(TokenType.PLUS, "+", null, 1),
          new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(10))
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("plus 2 string together should return AST correctly", () => {
    const input = `"hello" + "world"`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal("hello"),
          new Token(TokenType.PLUS, "+", null, 1),
          new Literal("world")
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("star operator (*) should have higher precedence than plus operator (+)", () => {
    const input = `1 + 2 * 3`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal(1),
          new Token(TokenType.PLUS, "+", null, 1),
          new Binary(
            new Literal(2),
            new Token(TokenType.STAR, "*", null, 1),
            new Literal(3)
          )
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });
});

export default {};
