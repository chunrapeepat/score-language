import {
  ExprVisitor,
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  ExplicitType,
} from "./Expr";
import { StmtVisitor, Stmt, Expression } from "./Stmt";
import { TokenType } from "./TokenType";

export class JSPrinter implements StmtVisitor<string>, ExprVisitor<string> {
  print(statements: Stmt[]): string {
    let output = "";
    statements.forEach((statement) => {
      output += statement.accept(this);
    });
    return output.trim();
  }

  visitExplicitTypeExpr(expr: ExplicitType): string {
    // TODO: implement this later
    return "";
  }
  visitExpressionStmt(expr: Expression): string {
    return `${expr.expression.accept(this)};`;
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
    if (expr.value == null) return "null";
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
