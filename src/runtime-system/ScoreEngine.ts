import { JSPrinter } from "../transpiler/JSPrinter";
import { Parser } from "../transpiler/Parser";
import { Scanner } from "../transpiler/Scanner";
import { Stmt } from "../transpiler/Stmt";
import { Token } from "../transpiler/Token";

export class ScoreEngine {
  private code: string;
  private compiledCode: string | null;
  private errors: Error[] = [];

  constructor(code: string) {
    this.code = code;
    this.compiledCode = null;
  }

  public getErrors(): Error[] {
    return this.errors;
  }

  public compile(): boolean {
    const scanner = new Scanner(this.code);
    let tokens: Token[];
    try {
      tokens = scanner.scanTokens();
    } catch (e) {
      this.errors = [...this.errors, ...scanner.getErrors()];
      return false;
    }

    const parser = new Parser(tokens);
    let syntaxTree: Stmt[];
    try {
      syntaxTree = parser.parse();
    } catch (e) {
      this.errors = [...this.errors, ...parser.getErrors()];
      return false;
    }

    try {
      const printer = new JSPrinter();
      this.compiledCode = printer.print(syntaxTree);
    } catch (e) {
      this.errors = [...this.errors, ...parser.getErrors()];
      return false;
    }

    return true;
  }
}
