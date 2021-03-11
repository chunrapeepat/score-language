export interface CompilationErrorInterface extends Error {
  getLine(): number;
  getLexeme(): string;
}

export class SyntaxError extends Error implements CompilationErrorInterface {
  private readonly lexeme: string;
  private readonly lineNumber: number;

  constructor(lexeme: string, lineNumber: number, message: string) {
    super(message);
    this.name = "SyntaxError";
    this.lexeme = lexeme;
    this.lineNumber = lineNumber;
  }

  getLexeme(): string {
    return this.lexeme;
  }
  getLine(): number {
    return this.lineNumber;
  }
}

export class UnexpectedToken
  extends Error
  implements CompilationErrorInterface {
  private readonly lexeme: string;
  private readonly lineNumber: number;

  constructor(lexeme: string, lineNumber: number) {
    super(`unexpected character '${lexeme}'`);
    this.name = "UnexpectedToken";
    this.lexeme = lexeme;
    this.lineNumber = lineNumber;
  }

  getLexeme(): string {
    return this.lexeme;
  }
  getLine(): number {
    return this.lineNumber;
  }
}
