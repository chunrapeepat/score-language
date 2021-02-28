import {
  ExprVisitor,
  Binary,
  Grouping,
  Literal,
  Unary,
  ExplicitType,
  Variable,
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
} from "./Stmt";
import { TokenType } from "./TokenType";

export class JSPrinter implements StmtVisitor<string>, ExprVisitor<string> {
  print(statements: Stmt[]): string {
    let output = "";
    statements.forEach((statement) => {
      output += statement.accept(this);
    });
    return output.trim();
  }

  visitPlayStatementStmt(statement: PlayStatement) {
    if (statement.type === "note") {
      return `await this.playNote(${statement.value.accept(
        this
      )}, ${statement.duration?.accept(this)});`;
    }
    return "";
  }
  visitWaitStatementStmt(statement: WaitStatement) {
    return `await this.wait(${statement.duration.accept(this)});`;
  }
  visitSayStatementStmt(statement: SayStatement) {
    return `await this.say(${statement.value.accept(
      this
    )}, ${statement.duration?.accept(this)});`;
  }
  visitPrintStatementStmt(statement: PrintStatement) {
    return `this.print(${statement.value.accept(this)});`;
  }
  visitSetStatementStmt(statement: SetStatement) {
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

  visitVariableExpr(variable: Variable): string {
    return `_${variable.name.lexeme}`;
  }
  visitExplicitTypeExpr(expr: ExplicitType): string {
    // TODO: implement this later
    return "";
  }
  visitBinaryExpr(expr: Binary): string {
    return `${expr.left.accept(this)} ${
      expr.operator.lexeme
    } ${expr.right.accept(this)}`;
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
