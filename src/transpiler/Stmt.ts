import { Token } from "./Token";
import { Expr } from "./Expr";

export interface StmtVisitor<R> {
  visitExpressionStmt(expr: Expression): R;
  visitVarStatementStmt(expr: VarStatement): R;
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

export class VarStatement implements Stmt {
  readonly name: Token;
  readonly initializer: Expr;

  constructor(name: Token, initializer: Expr) {
    this.name = name;
    this.initializer = initializer;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitVarStatementStmt(this);
  }
}
