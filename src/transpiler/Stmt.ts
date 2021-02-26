import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { Expr } from "./Expr";

export interface StmtVisitor<R> {
  visitExpressionStmt(expr: Expression): R;
}
export interface Stmt {
  accept<R>(visitor: StmtVisitor<R>): R;
}

export class Expression implements Stmt {
  readonly expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitExpressionStmt(this);
  }
}
