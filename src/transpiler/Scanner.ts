import { Token } from "./Token";
import { TokenType } from "./TokenType";
import {
  UnexpectedToken,
  SyntaxError,
  CompilationErrorInterface,
} from "./Error";

export class Scanner {
  private readonly source: string;
  private readonly tokens: Token[] = [];
  private readonly errors: CompilationErrorInterface[] = [];

  private start: number = 0;
  private current: number = 0;
  private line: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    if (this.errors.length > 0) {
      throw new Error("failed to scan characters");
    }

    // auto insert new-line at the end of file
    this.tokens.push(new Token(TokenType.NEWLINE, "\n", null, this.line));
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line + 1));
    return this.tokens;
  }

  getErrors() {
    return this.errors;
  }

  private scanToken() {
    const c: string = this.advance();
    switch (c) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "[":
        this.addToken(TokenType.LEFT_BRACKET);
        break;
      case "]":
        this.addToken(TokenType.RIGHT_BRACKET);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;

      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.NOT);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      case "/":
        this.addToken(TokenType.SLASH);
        break;
      case "#":
        while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
        break;

      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.addToken(TokenType.NEWLINE);
        this.line++;
        break;

      case '"':
        this.string();
        break;

      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          this.errors.push(new UnexpectedToken(c, this.line));
        }
        break;
    }
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const keywords: { [key: string]: TokenType } = {};
    keywords["and"] = TokenType.AND;
    keywords["or"] = TokenType.OR;
    keywords["mod"] = TokenType.MOD;
    keywords["not"] = TokenType.NOT;
    keywords["true"] = TokenType.TRUE;
    keywords["false"] = TokenType.FALSE;
    keywords["null"] = TokenType.NULL;
    keywords["number"] = TokenType.TYPE_NUMBER;
    keywords["string"] = TokenType.TYPE_STRING;
    keywords["boolean"] = TokenType.TYPE_BOOLEAN;
    keywords["else"] = TokenType.ELSE;
    keywords["var"] = TokenType.VAR;
    keywords["set"] = TokenType.SET;
    keywords["play"] = TokenType.PLAY;
    keywords["wait"] = TokenType.WAIT;
    keywords["say"] = TokenType.SAY;
    keywords["print"] = TokenType.PRINT;
    keywords["if"] = TokenType.IF;
    keywords["else"] = TokenType.ELSE;
    keywords["end"] = TokenType.END;
    keywords["while"] = TokenType.WHILE;
    keywords["repeat"] = TokenType.REPEAT;
    keywords["exit"] = TokenType.EXIT;
    keywords["break"] = TokenType.BREAK;
    keywords["continue"] = TokenType.CONTINUE;

    const text: string = this.source.substring(this.start, this.current);
    let type: TokenType = keywords[text];
    if (type == undefined) type = TokenType.IDENTIFIER;
    this.addToken(type);
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_";
  }

  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private number() {
    while (this.isDigit(this.peek())) this.advance();

    // Look for a fractional part.
    if (this.peek() == "." && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }

    this._addToken(
      TokenType.NUMBER,
      Number.parseFloat(this.source.substring(this.start, this.current))
    );
  }

  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  private string() {
    let isUnterminatedString = false;

    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == "\n") {
        isUnterminatedString = true;
        break;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      isUnterminatedString = true;
    }

    if (isUnterminatedString) {
      return this.errors.push(
        new SyntaxError(this.peek(), this.line, "unterminated string")
      );
    }

    // The closing ".
    this.advance();

    // Trim the surrounding quotes.
    const value: string = this.source.substring(
      this.start + 1,
      this.current - 1
    );
    this._addToken(TokenType.STRING, value);
  }

  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  private advance(): string {
    this.current++;
    return this.source.charAt(this.current - 1);
  }

  private addToken(type: TokenType) {
    this._addToken(type, null);
  }

  private _addToken(type: TokenType, literal: any) {
    const text: string = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }
}
