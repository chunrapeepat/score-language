import {
  Binary,
  Expr,
  Grouping,
  Literal,
  Unary,
  ExplicitType,
  Variable,
  FunctionCall,
} from "./Expr";
import {
  Stmt,
  Expression,
  VarStatement,
  SetStatement,
  PrintStatement,
  WaitStatement,
  SayStatement,
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
import { CompilationErrorInterface, SyntaxError } from "./Error";

export class Parser {
  private readonly tokens: Token[];
  private current: number = 0;
  private errors: CompilationErrorInterface[] = [];
  private allowBreakOrContinueStmt: boolean = false;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): Stmt[] {
    const statements: Stmt[] = [];
    while (!this.isAtEnd()) {
      if (this.match(TokenType.NEWLINE)) continue;

      try {
        statements.push(this.statement());
      } catch (e) {
        this.errors.push(e);
      }
    }

    if (this.errors.length > 0) {
      throw new Error("failed to parse tokens");
    }

    return statements;
  }

  getErrors(): CompilationErrorInterface[] {
    return this.errors;
  }

  private statement(): Stmt {
    if (this.match(TokenType.VAR)) {
      return this.varStatement();
    }
    if (this.match(TokenType.SET)) {
      return this.setStatement();
    }
    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }
    if (this.match(TokenType.WAIT)) {
      return this.waitStatement();
    }
    if (this.match(TokenType.SAY)) {
      return this.sayStatement();
    }
    if (this.match(TokenType.PLAY)) {
      return this.playStatement();
    }
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }
    if (this.match(TokenType.WHILE)) {
      return this.whileStatement();
    }
    if (this.match(TokenType.REPEAT)) {
      return this.repeatStatement();
    }
    if (this.match(TokenType.EXIT)) {
      return this.exitStatement();
    }
    if (this.match(TokenType.CONTINUE)) {
      return this.continueStatement();
    }
    if (this.match(TokenType.BREAK)) {
      return this.breakStatement();
    }
    return this.expressionStatement();
  }

  private breakStatement(): Stmt {
    if (!this.allowBreakOrContinueStmt) {
      throw this.error(this.previous(), "illegal break statement");
    }

    this.consume(TokenType.NEWLINE, `expect 'new line' after 'break' keyword`);
    return new BreakStatement();
  }

  private continueStatement(): Stmt {
    if (!this.allowBreakOrContinueStmt) {
      throw this.error(this.previous(), "illegal continue statement");
    }

    this.consume(
      TokenType.NEWLINE,
      `expect 'new line' after 'continue' keyword`
    );
    return new ContinueStatement();
  }

  private repeatStatement(): Stmt {
    const n: Expr = this.expression();
    this.consumeIdentifier(
      "times",
      `expect 'times' keyword in 'while' statement.`
    );
    this.consume(TokenType.THEN, `expect 'then' after 'while' statement`);
    this.consume(
      TokenType.NEWLINE,
      `expect 'new line' after 'then' keyword in 'while' statement`
    );

    this.allowBreakOrContinueStmt = true;
    const body: Stmt[] = [];
    while (!this.isAtEnd()) {
      if (this.match(TokenType.NEWLINE)) continue;
      if (this.peek().type === TokenType.END) break;

      try {
        body.push(this.statement());
      } catch (e) {
        this.errors.push(e);
      }
    }

    if (this.match(TokenType.END)) {
      this.consume(
        TokenType.NEWLINE,
        `expect 'new line' after 'end' keyword in 'while' statement`
      );

      this.allowBreakOrContinueStmt = false;
      return new RepeatStatement(n, body);
    }

    throw this.error(this.peek(), "invalid repeat statement");
  }

  private whileStatement(): Stmt {
    const test: Expr = this.expression();
    this.consume(TokenType.THEN, `expect 'then' after 'while' statement`);
    this.consume(
      TokenType.NEWLINE,
      `expect 'new line' after 'then' keyword in 'while' statement`
    );

    this.allowBreakOrContinueStmt = true;
    const body: Stmt[] = [];
    while (!this.isAtEnd()) {
      if (this.match(TokenType.BREAK)) {
        this.consume(
          TokenType.NEWLINE,
          `expect 'new line' after 'break' keyword`
        );
        body.push(new BreakStatement());
        continue;
      }
      if (this.match(TokenType.CONTINUE)) {
        this.consume(
          TokenType.NEWLINE,
          `expect 'new line' after 'continue' keyword`
        );
        body.push(new ContinueStatement());
        continue;
      }
      if (this.match(TokenType.NEWLINE)) continue;
      if (this.peek().type === TokenType.END) break;

      try {
        body.push(this.statement());
      } catch (e) {
        this.errors.push(e);
      }
    }

    if (this.match(TokenType.END)) {
      this.consume(
        TokenType.NEWLINE,
        `expect 'new line' after 'end' keyword in 'while' statement`
      );

      this.allowBreakOrContinueStmt = false;
      return new WhileStatement(test, body);
    }

    throw this.error(this.peek(), "invalid while statement");
  }

  private ifStatement(): Stmt {
    const test: Expr = this.expression();
    this.consume(TokenType.THEN, `expect 'then' after 'if' statement`);
    this.consume(
      TokenType.NEWLINE,
      `expect 'new line' after 'then' keyword in 'if' statement`
    );

    const consequent: Stmt[] = [];
    while (!this.isAtEnd()) {
      if (this.match(TokenType.NEWLINE)) continue;
      if (
        this.peek().type === TokenType.END ||
        this.peek().type === TokenType.ELSE
      )
        break;

      try {
        consequent.push(this.statement());
      } catch (e) {
        this.errors.push(e);
      }
    }

    if (this.match(TokenType.END)) {
      this.consume(
        TokenType.NEWLINE,
        `expect 'new line' after 'end' keyword in 'if' statement`
      );
      return new IfStatement(test, consequent);
    }

    if (this.match(TokenType.ELSE)) {
      if (this.match(TokenType.NEWLINE)) {
        const alternate: Stmt[] = [];
        while (!this.isAtEnd()) {
          if (this.match(TokenType.NEWLINE)) continue;
          if (this.peek().type === TokenType.END) break;

          try {
            alternate.push(this.statement());
          } catch (e) {
            this.errors.push(e);
          }
        }

        if (this.match(TokenType.END)) {
          this.consume(
            TokenType.NEWLINE,
            `expect 'new line' after 'end' keyword in 'if' statement`
          );
          return new IfStatement(test, consequent, alternate);
        }
      }

      if (this.match(TokenType.IF)) {
        const elseIfStatement = this.ifStatement() as IfStatement;
        return new IfStatement(test, consequent, elseIfStatement);
      }
    }

    throw this.error(this.peek(), "invalid if statement");
  }

  private exitStatement(): Stmt {
    this.consumeIdentifier(
      "program",
      `expect 'program' keyword after 'exit' statement.`
    );
    return new ExitStatement();
  }

  private playStatement(): Stmt {
    this.consumeIdentifier(
      "note",
      `expect 'note' keyword after 'play' statement`
    );
    const value: Expr = this.expression();
    if (this.matchIdentifier("for")) {
      const duration: Expr = this.expression();
      this.consumeIdentifier(
        "secs",
        `expect 'secs' keyword after 'play' statement`
      );
      return new PlayStatement("note", value, duration);
    }
    return new PlayStatement("note", value);
  }

  private sayStatement(): Stmt {
    const value: Expr = this.expression();
    if (this.matchIdentifier("for")) {
      const duration: Expr = this.expression();
      this.consumeIdentifier(
        "secs",
        `expect 'secs' keyword after 'say' statement`
      );
      return new SayStatement(value, duration);
    }
    return new SayStatement(value);
  }

  private waitStatement(): Stmt {
    const duration: Expr = this.expression();
    this.consumeIdentifier(
      "secs",
      `expect 'secs' keyword after 'wait' statement`
    );
    return new WaitStatement(duration);
  }

  private printStatement(): Stmt {
    const value: Expr = this.expression();
    this.consume(
      TokenType.NEWLINE,
      "expect 'new line' after 'print' statement"
    );
    return new PrintStatement(value);
  }

  private setStatement(): Stmt {
    const variableName: Token = this.consume(
      TokenType.IDENTIFIER,
      "expect an identifier after 'set' keyword"
    );
    this.consume(
      TokenType.EQUAL,
      "expect '=' after an identifier in 'set' statement"
    );
    const value: Expr = this.expression();
    this.consume(TokenType.NEWLINE, "expect 'new line' after 'set' statement");
    return new SetStatement(variableName, value);
  }

  private varStatement(): Stmt {
    const variableName: Token = this.consume(
      TokenType.IDENTIFIER,
      "expect an identifier after 'var' keyword"
    );
    let initializer: Expr = new Literal(null);
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.NEWLINE, "expect 'new line' after 'var' statement");
    return new VarStatement(variableName, initializer);
  }

  private expressionStatement(): Stmt {
    const value: Expr = this.expression();
    this.consume(TokenType.NEWLINE, "expect 'new line' after value");
    return new Expression(value);
  }

  private expression(): Expr {
    return this.logicOr();
  }

  private logicOr(): Expr {
    let expr: Expr = this.logicAnd();

    while (this.match(TokenType.OR)) {
      const operator: Token = this.previous();
      const right: Expr = this.logicAnd();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private logicAnd(): Expr {
    let expr: Expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator: Token = this.previous();
      const right: Expr = this.equality();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private equality(): Expr {
    let expr: Expr = this.comparison();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator: Token = this.previous();
      const right: Expr = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private comparison(): Expr {
    let expr: Expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator: Token = this.previous();
      const right: Expr = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private term(): Expr {
    let expr: Expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private factor(): Expr {
    let expr: Expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR, TokenType.MOD)) {
      const operator: Token = this.previous();
      const right: Expr = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expr {
    if (this.match(TokenType.NOT, TokenType.MINUS, TokenType.PLUS)) {
      const operator: Token = this.previous();
      const right: Expr = this.unary();
      return new Unary(operator, right);
    }
    if (this.match(TokenType.LEFT_BRACKET)) {
      return this.functionCall();
    }

    return this.primary();
  }

  private functionCall(): Expr {
    const functionName = this.consume(
      TokenType.IDENTIFIER,
      "expect function name after '['"
    );

    const args: Expr[] = [];
    while (this.peek().type !== TokenType.RIGHT_BRACKET) {
      try {
        args.push(this.expression());
      } catch (e) {
        this.errors.push(e);
      }
    }

    this.consume(TokenType.RIGHT_BRACKET, "expect ']' after function call");
    return new FunctionCall(functionName, args);
  }

  private primary(): Expr {
    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }
    if (this.match(TokenType.FALSE)) {
      return new Literal(false);
    }
    if (this.match(TokenType.TRUE)) {
      return new Literal(true);
    }
    if (this.match(TokenType.NULL)) {
      return new Literal(null);
    }
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }
    if (
      this.match(
        TokenType.TYPE_BOOLEAN,
        TokenType.TYPE_STRING,
        TokenType.TYPE_NUMBER
      )
    ) {
      return new ExplicitType(this.previous().type);
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "expect ')' after expression");
      return new Grouping(expr);
    }

    throw this.error(this.peek(), "invalid statement");
  }

  private consumeIdentifier(identifierName: string, message: string) {
    if (
      this.check(TokenType.IDENTIFIER) &&
      this.peek().lexeme === identifierName
    )
      return this.advance();

    throw this.error(this.peek(), message);
  }
  private consume(type: TokenType, message: string) {
    if (this.check(type)) return this.advance();

    throw this.error(this.peek(), message);
  }
  private error(token: Token, message: string) {
    // synchornize until it has found statement boundary
    this.synchornize();

    return new SyntaxError(token.lexeme, token.line, message);
  }
  private synchornize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.NEWLINE) return;
      this.advance();
    }
  }
  private matchIdentifier(...identifierNames: string[]): boolean {
    for (const identifierName of identifierNames) {
      if (
        this.check(TokenType.IDENTIFIER) &&
        this.peek().lexeme === identifierName
      ) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }
  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }
  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }
  private isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF;
  }
  private peek(): Token {
    return this.tokens[this.current];
  }
  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
