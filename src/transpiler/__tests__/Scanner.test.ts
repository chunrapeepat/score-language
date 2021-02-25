import { Scanner } from "../Scanner";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

describe("scanner should return a list of token correctly with EOF at the end", () => {
  test("logical operators", () => {
    const input = `! not != = == > >= < <=`;
    const expectedOutput = [
      new Token(TokenType.NOT, "!", null, 1),
      new Token(TokenType.NOT, "not", null, 1),
      new Token(TokenType.BANG_EQUAL, "!=", null, 1),
      new Token(TokenType.EQUAL, "=", null, 1),
      new Token(TokenType.EQUAL_EQUAL, "==", null, 1),
      new Token(TokenType.GREATER, ">", null, 1),
      new Token(TokenType.GREATER_EQUAL, ">=", null, 1),
      new Token(TokenType.LESS, "<", null, 1),
      new Token(TokenType.LESS_EQUAL, "<=", null, 1),
      new Token(TokenType.EOF, "", null, 1),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("keywords", () => {
    const input = `and or mod not true false null number string boolean`;
    const expectedOutput = [
      new Token(TokenType.AND, "and", null, 1),
      new Token(TokenType.OR, "or", null, 1),
      new Token(TokenType.MOD, "mod", null, 1),
      new Token(TokenType.NOT, "not", null, 1),
      new Token(TokenType.TRUE, "true", null, 1),
      new Token(TokenType.FALSE, "false", null, 1),
      new Token(TokenType.NULL, "null", null, 1),
      new Token(TokenType.TYPE_NUMBER, "number", null, 1),
      new Token(TokenType.TYPE_STRING, "string", null, 1),
      new Token(TokenType.TYPE_BOOLEAN, "boolean", null, 1),
      new Token(TokenType.EOF, "", null, 1),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("new line", () => {
    const input = `"line 1"\n"line 2"`;
    const expectedOutput = [
      new Token(TokenType.STRING, '"line 1"', "line 1", 1),
      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.STRING, '"line 2"', "line 2", 2),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("literals", () => {
    const input = `"this is a string" 30.1235 500 varName true false null`;
    const expectedOutput = [
      new Token(TokenType.STRING, '"this is a string"', "this is a string", 1),
      new Token(TokenType.NUMBER, "30.1235", 30.1235, 1),
      new Token(TokenType.NUMBER, "500", 500, 1),
      new Token(TokenType.IDENTIFIER, "varName", null, 1),
      new Token(TokenType.TRUE, "true", null, 1),
      new Token(TokenType.FALSE, "false", null, 1),
      new Token(TokenType.NULL, "null", null, 1),
      new Token(TokenType.EOF, "", null, 1),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("mathematical expression", () => {
    const input = `(3 * 1 + 5 - 2) / (5 mod 3)`;
    const expectedOutput = [
      new Token(TokenType.LEFT_PAREN, "(", null, 1),
      new Token(TokenType.NUMBER, "3", 3, 1),
      new Token(TokenType.STAR, "*", null, 1),
      new Token(TokenType.NUMBER, "1", 1, 1),
      new Token(TokenType.PLUS, "+", null, 1),
      new Token(TokenType.NUMBER, "5", 5, 1),
      new Token(TokenType.MINUS, "-", null, 1),
      new Token(TokenType.NUMBER, "2", 2, 1),
      new Token(TokenType.RIGHT_PAREN, ")", null, 1),
      new Token(TokenType.SLASH, "/", null, 1),
      new Token(TokenType.LEFT_PAREN, "(", null, 1),
      new Token(TokenType.NUMBER, "5", 5, 1),
      new Token(TokenType.MOD, "mod", null, 1),
      new Token(TokenType.NUMBER, "3", 3, 1),
      new Token(TokenType.RIGHT_PAREN, ")", null, 1),
      new Token(TokenType.EOF, "", null, 1),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });
});

export default {};
