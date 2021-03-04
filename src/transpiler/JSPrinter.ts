import {
  ExprVisitor,
  Binary,
  Grouping,
  Literal,
  Unary,
  ExplicitType,
  Variable,
  FunctionCall,
} from "./Expr";
import {
  VarStatement,
  StmtVisitor,
  Stmt,
  Expression,
  SetStatement,
  PrintStatement,
  SayStatement,
  WaitStatement,
  PlayStatement,
  IfStatement,
  WhileStatement,
  RepeatStatement,
  ExitStatement,
  BreakStatement,
  ContinueStatement,
} from "./Stmt";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class JSPrinter implements StmtVisitor<string>, ExprVisitor<string> {
  private avoidJSReferenceError: boolean = false;

  print(statements: Stmt[]): string {
    let output = "";
    statements.forEach((statement) => {
      output += statement.accept(this);
    });
    return output.trim();
  }

  visitBreakStatementStmt(_: BreakStatement): string {
    return `break;`;
  }
  visitContinueStatementStmt(_: ContinueStatement): string {
    return `continue;`;
  }
  visitExitStatementStmt(_: ExitStatement): string {
    return `this.exitProgram();`;
  }
  visitRepeatStatementStmt(statement: RepeatStatement): string {
    return `{for (let i = 0; i < ${statement.n.accept(
      this
    )}; ++i) {${statement.body.map((s) => s.accept(this)).join("")}}}`;
  }
  visitWhileStatementStmt(statement: WhileStatement): string {
    return `while (${statement.test.accept(this)}) {${statement.body
      .map((s) => s.accept(this))
      .join("")}}`;
  }
  visitIfStatementStmt(statement: IfStatement): string {
    if (!statement.alternate) {
      return `if (${statement.test.accept(
        this
      )}) {${statement.consequent.map((s) => s.accept(this)).join("")}}`;
    }

    if (Array.isArray(statement.alternate)) {
      return `if (${statement.test.accept(
        this
      )}) {${statement.consequent
        .map((s) => s.accept(this))
        .join("")}} else {${statement.alternate
        .map((s) => s.accept(this))
        .join("")}}`;
    }

    return `if (${statement.test.accept(
      this
    )}) {${statement.consequent
      .map((s) => s.accept(this))
      .join("")}} else ${statement.alternate.accept(this)}`;
  }
  visitPlayStatementStmt(statement: PlayStatement): string {
    if (statement.type === "note") {
      return `await this.playNote(${statement.value.accept(
        this
      )}, ${statement.duration?.accept(this)});`;
    }
    return "";
  }
  visitWaitStatementStmt(statement: WaitStatement): string {
    return `await this.wait(${statement.duration.accept(this)});`;
  }
  visitSayStatementStmt(statement: SayStatement): string {
    return `await this.say(${statement.value.accept(
      this
    )}, ${statement.duration?.accept(this)});`;
  }
  visitPrintStatementStmt(statement: PrintStatement): string {
    return `this.print(${statement.value.accept(this)});`;
  }
  visitSetStatementStmt(statement: SetStatement): string {
    return `_${statement.name.lexeme} = ${statement.value.accept(this)};`;
  }
  visitVarStatementStmt(statement: VarStatement): string {
    return `let _${statement.name.lexeme} = ${statement.initializer.accept(
      this
    )};`;
  }
  visitExpressionStmt(expr: Expression): string {
    return `${expr.expression.accept(this)};`;
  }

  visitFunctionCallExpr(expr: FunctionCall): string {
    this.avoidJSReferenceError = true;
    const result = `this.functionCall("${
      expr.name.lexeme
    }", [${expr.args.map((e) => e.accept(this)).join(",")}])`;
    this.avoidJSReferenceError = false;
    return result;
  }
  visitVariableExpr(variable: Variable): string {
    if (this.avoidJSReferenceError) {
      return `(typeof _${variable.name.lexeme} === "undefined" ? undefined : _${variable.name.lexeme})`;
    }
    return `_${variable.name.lexeme}`;
  }
  visitExplicitTypeExpr(expr: ExplicitType): string {
    switch (expr.type) {
      case TokenType.TYPE_NUMBER:
        return "type_number";
      case TokenType.TYPE_STRING:
        return "type_string";
      case TokenType.TYPE_BOOLEAN:
        return "type_boolean";
      default:
        return "type_any";
    }
  }
  visitBinaryExpr(expr: Binary): string {
    let operator;
    switch (expr.operator.type) {
      case TokenType.EQUAL_EQUAL:
        operator = "===";
        break;
      case TokenType.MOD:
        operator = "%";
        break;
      case TokenType.AND:
        operator = "&&";
        break;
      case TokenType.OR:
        operator = "||";
        break;
      default:
        operator = expr.operator.lexeme;
    }

    return `${expr.left.accept(this)} ${operator} ${expr.right.accept(this)}`;
  }
  visitGroupingExpr(expr: Grouping): string {
    return `(${expr.expression.accept(this)})`;
  }
  visitLiteralExpr(expr: Literal): string {
    if (expr.value === null) return "null";
    if (typeof expr.value === "string") return `"${expr.value}"`;
    return expr.value.toString();
  }
  visitUnaryExpr(expr: Unary): string {
    let operator = expr.operator.lexeme;
    if (expr.operator.type === TokenType.NOT) {
      operator = "!";
    }
    return `${operator}${expr.right.accept(this)}`;
  }
}
