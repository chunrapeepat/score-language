import { Token } from "./Token";
import { TokenType } from "./TokenType";
export interface ExprVisitor<R> {
  visitBinaryExpr(expr: Binary): R;
  visitGroupingExpr(expr: Grouping): R;
  visitLiteralExpr(expr: Literal): R;
  visitUnaryExpr(expr: Unary): R;
  visitExplicitTypeExpr(expr: ExplicitType): R;
  visitVariableExpr(expr: Variable): R;
  visitFunctionCallExpr(expr: FunctionCall): R;
}
export interface Expr {
  accept<R>(visitor: ExprVisitor<R>): R;
}

export class Binary implements Expr {
  readonly left: Expr;
  readonly operator: Token;
  readonly right: Expr;

  constructor(left: Expr, operator: Token, right: Expr) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitBinaryExpr(this);
  }
}

export class Grouping implements Expr {
  readonly expression: Expr;

  constructor(expression: Expr) {
    this.expression = expression;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitGroupingExpr(this);
  }
}

export class Literal implements Expr {
  readonly value: any;

  constructor(value: any) {
    this.value = value;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitLiteralExpr(this);
  }
}

export class Unary implements Expr {
  readonly operator: Token;
  readonly right: Expr;

  constructor(operator: Token, right: Expr) {
    this.operator = operator;
    this.right = right;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitUnaryExpr(this);
  }
}

export class ExplicitType implements Expr {
  readonly type: TokenType;

  constructor(type: TokenType) {
    this.type = type;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitExplicitTypeExpr(this);
  }
}

export class Variable implements Expr {
  readonly name: Token;

  constructor(name: Token) {
    this.name = name;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitVariableExpr(this);
  }
}

export class FunctionCall implements Expr {
  readonly name: Token;
  readonly args: Expr[];

  constructor(name: Token, args: Expr[]) {
    this.name = name;
    this.args = args;
  }

  accept<R>(visitor: ExprVisitor<R>): R {
    return visitor.visitFunctionCallExpr(this);
  }
}
