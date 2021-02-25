import { Scanner } from "../Scanner";
import { Token } from "../Token";
import { TokenType } from "../TokenType";

describe("scanner should return a list of token correctly with EOF at the end", () => {
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
