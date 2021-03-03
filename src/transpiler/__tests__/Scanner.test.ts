import { UnexpectedToken } from "../Error";
import { Scanner } from "../Scanner";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

describe("scanner should throw error", () => {
  it("should throw unexpected token error", () => {
    const input = `name = . ;`;

    const scanner = new Scanner(input);
    expect(() => scanner.scanTokens()).toThrow(Error);
    expect(scanner.getErrors().length).toBe(2);
    expect(scanner.getErrors()[0]).toBeInstanceOf(UnexpectedToken);
    expect(scanner.getErrors()[1]).toBeInstanceOf(UnexpectedToken);
    expect(scanner.getErrors()[0].getLine()).toBe(1);
    expect(scanner.getErrors()[0].getLexeme()).toBe(".");
    expect(scanner.getErrors()[1].getLine()).toBe(1);
    expect(scanner.getErrors()[1].getLexeme()).toBe(";");
  });
});

describe("scanner should return a list of token correctly with EOF at the end", () => {
  test("function call expression", () => {
    const input = `[random from 1 to 10]`;
    const expectedOutput = [
      new Token(TokenType.LEFT_BRACKET, "[", null, 1),
      new Token(TokenType.IDENTIFIER, "random", null, 1),
      new Token(TokenType.IDENTIFIER, "from", null, 1),
      new Token(TokenType.NUMBER, "1", 1, 1),
      new Token(TokenType.IDENTIFIER, "to", null, 1),
      new Token(TokenType.NUMBER, "10", 10, 1),
      new Token(TokenType.RIGHT_BRACKET, "]", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("break and continue statements", () => {
    const input = `break continue`;
    const expectedOutput = [
      new Token(TokenType.BREAK, "break", null, 1),
      new Token(TokenType.CONTINUE, "continue", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("exit statement", () => {
    const input = `exit program`;
    const expectedOutput = [
      new Token(TokenType.EXIT, "exit", null, 1),
      new Token(TokenType.IDENTIFIER, "program", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("repeat statement", () => {
    const input = `repeat 10 times then end`;
    const expectedOutput = [
      new Token(TokenType.REPEAT, "repeat", null, 1),
      new Token(TokenType.NUMBER, "10", 10, 1),
      new Token(TokenType.IDENTIFIER, "times", null, 1),
      new Token(TokenType.THEN, "then", null, 1),
      new Token(TokenType.END, "end", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("while statement", () => {
    const input = `while true then end`;
    const expectedOutput = [
      new Token(TokenType.WHILE, "while", null, 1),
      new Token(TokenType.TRUE, "true", null, 1),
      new Token(TokenType.THEN, "then", null, 1),
      new Token(TokenType.END, "end", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("if statement", () => {
    const input = `if then else end`;
    const expectedOutput = [
      new Token(TokenType.IF, "if", null, 1),
      new Token(TokenType.THEN, "then", null, 1),
      new Token(TokenType.ELSE, "else", null, 1),
      new Token(TokenType.END, "end", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("play statement", () => {
    const input = `play note 1 for 30 secs`;
    const expectedOutput = [
      new Token(TokenType.PLAY, "play", null, 1),
      new Token(TokenType.IDENTIFIER, "note", null, 1),
      new Token(TokenType.NUMBER, "1", 1, 1),
      new Token(TokenType.IDENTIFIER, "for", null, 1),
      new Token(TokenType.NUMBER, "30", 30, 1),
      new Token(TokenType.IDENTIFIER, "secs", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("wait statement", () => {
    const input = `wait 30 secs`;
    const expectedOutput = [
      new Token(TokenType.WAIT, "wait", null, 1),
      new Token(TokenType.NUMBER, "30", 30, 1),
      new Token(TokenType.IDENTIFIER, "secs", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("say statement", () => {
    const input = `say name`;
    const expectedOutput = [
      new Token(TokenType.SAY, "say", null, 1),
      new Token(TokenType.IDENTIFIER, "name", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("print statement", () => {
    const input = `print name`;
    const expectedOutput = [
      new Token(TokenType.PRINT, "print", null, 1),
      new Token(TokenType.IDENTIFIER, "name", null, 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("set statement", () => {
    const input = `set name = "steve"`;
    const expectedOutput = [
      new Token(TokenType.SET, "set", null, 1),
      new Token(TokenType.IDENTIFIER, "name", null, 1),
      new Token(TokenType.EQUAL, "=", null, 1),
      new Token(TokenType.STRING, '"steve"', "steve", 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

  test("var statement", () => {
    const input = `var name = "test"`;
    const expectedOutput = [
      new Token(TokenType.VAR, "var", null, 1),
      new Token(TokenType.IDENTIFIER, "name", null, 1),
      new Token(TokenType.EQUAL, "=", null, 1),
      new Token(TokenType.STRING, '"test"', "test", 1),

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });

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

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
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

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
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

      new Token(TokenType.NEWLINE, "\n", null, 2),
      new Token(TokenType.EOF, "", null, 3),
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

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
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

      new Token(TokenType.NEWLINE, "\n", null, 1),
      new Token(TokenType.EOF, "", null, 2),
    ];

    const scanner = new Scanner(input);
    expect(scanner.scanTokens()).toEqual(expectedOutput);
  });
});

export default {};
