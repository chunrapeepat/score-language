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
  IfStatement,
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
