import { JSPrinter } from "../transpiler/JSPrinter";
import { Parser } from "../transpiler/Parser";
import { Scanner } from "../transpiler/Scanner";
import { Stmt } from "../transpiler/Stmt";
import { Token } from "../transpiler/Token";
import { ScoreRuntimeContext } from "./ScoreRuntimeContext";

declare global {
  interface Window {
    runtimeContext?: ScoreRuntimeContext;
  }
}

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

  public execute(): boolean {
    if (this.compiledCode === null || this.errors.length > 0) {
      return false;
    }

    this._setupEnvironment();
    eval(
      `(async function() {try {${this.compiledCode}} catch(e) {this.handleError(e)}}).call(window.runtimeContext)`
    );
    return true;
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

  private _setupEnvironment() {
    window.runtimeContext = new ScoreRuntimeContext();

    const runtimeOutput = document.getElementById("score_runtime_output");
    if (runtimeOutput) {
      runtimeOutput.innerHTML = "";
    }
  }
}
