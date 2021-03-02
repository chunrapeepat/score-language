import { Token } from "./Token";
import { Expr } from "./Expr";

export interface StmtVisitor<R> {
  visitExpressionStmt(stmt: Expression): R;
  visitVarStatementStmt(stmt: VarStatement): R;
  visitSetStatementStmt(stmt: SetStatement): R;
  visitWaitStatementStmt(stmt: WaitStatement): R;
  visitPrintStatementStmt(stmt: PrintStatement): R;
  visitSayStatementStmt(stmt: SayStatement): R;
  visitPlayStatementStmt(stmt: PlayStatement): R;
  visitIfStatementStmt(stmt: IfStatement): R;
  visitWhileStatementStmt(stmt: WhileStatement): R;
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

export class SetStatement implements Stmt {
  readonly name: Token;
  readonly value: Expr;

  constructor(name: Token, value: Expr) {
    this.name = name;
    this.value = value;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitSetStatementStmt(this);
  }
}

export class WaitStatement implements Stmt {
  readonly duration: Expr;

  constructor(duration: Expr) {
    this.duration = duration;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitWaitStatementStmt(this);
  }
}

export class PrintStatement implements Stmt {
  readonly value: Expr;

  constructor(value: Expr) {
    this.value = value;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitPrintStatementStmt(this);
  }
}

export class SayStatement implements Stmt {
  readonly value: Expr;
  readonly duration?: Expr;

  constructor(value: Expr, duration?: Expr) {
    this.value = value;
    this.duration = duration;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitSayStatementStmt(this);
  }
}

export class PlayStatement implements Stmt {
  readonly type: "note";
  readonly value: Expr;
  readonly duration?: Expr;

  constructor(type: "note", value: Expr, duration?: Expr) {
    this.type = type;
    this.value = value;
    this.duration = duration;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitPlayStatementStmt(this);
  }
}

export class IfStatement implements Stmt {
  readonly test: Expr;
  readonly consequent: Stmt[];
  readonly alternate?: IfStatement | Stmt[];

  constructor(
    test: Expr,
    consequent: Stmt[],
    alternate?: IfStatement | Stmt[]
  ) {
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitIfStatementStmt(this);
  }
}

export class WhileStatement implements Stmt {
  readonly test: Expr;
  readonly body: Stmt[];

  constructor(test: Expr, body: Stmt[]) {
    this.test = test;
    this.body = body;
  }

  accept<R>(visitor: StmtVisitor<R>): R {
    return visitor.visitWhileStatementStmt(this);
  }
}
