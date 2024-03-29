import {
  Binary,
  FunctionCall,
  Grouping,
  Literal,
  Unary,
  Variable,
} from "../Expr";
import { Parser } from "../Parser";
import { Scanner } from "../Scanner";
import {
  Expression,
  VarStatement,
  SetStatement,
  PlayStatement,
  WaitStatement,
  PrintStatement,
  SayStatement,
  IfStatement,
  WhileStatement,
  RepeatStatement,
  ExitStatement,
  BreakStatement,
  ContinueStatement,
} from "../Stmt";
import { Token } from "../Token";
import { TokenType } from "../TokenType";
import { SyntaxError } from "../Error";

describe("parse error", () => {
  it("should parse error when use continue or break statement outside while and repeat", () => {
    const input = `
      break
      repeat 10 times 
        continue
      end
    `;

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(() => parser.parse()).toThrow(Error);
    expect(parser.getErrors().length).toBe(1);
    expect(parser.getErrors()[0].getLine()).toBe(2);
  });

  it("should detect multiple errors", () => {
    const input = `!-+\n\n(10\n\n+`;

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(() => parser.parse()).toThrow(Error);
    expect(parser.getErrors().length).toBe(3);
  });

  it("should detect invalid mathematical expression", () => {
    const input = `!-+`;

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(() => parser.parse()).toThrow(Error);
    expect(parser.getErrors().length).toBe(1);
    expect(parser.getErrors()[0]).toBeInstanceOf(SyntaxError);
  });

  test("open-paren must be followed by close-paren within the same line", () => {
    const input = `(10 + 20`;

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(() => parser.parse()).toThrow(Error);
    expect(parser.getErrors().length).toBe(1);
    expect(parser.getErrors()[0]).toBeInstanceOf(SyntaxError);
  });
});

describe("parse statements", () => {
  it("should parse break and continue statements in repeat and while correctly", () => {
    const input = `
      repeat 10 times 
        continue
      end

      while true 
        if true 
          break
        end
      end
    `;

    const expectedOutput = [
      new RepeatStatement(new Literal(10), [new ContinueStatement()]),
      new WhileStatement(new Literal(true), [
        new IfStatement(new Literal(true), [new BreakStatement()]),
      ]),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse exit statement correctly", () => {
    const input = `exit`;

    const expectedOutput = [new ExitStatement()];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse repeat statement correctly", () => {
    const input = `
      repeat 10 times 
        print "hello"
      end
    `;

    const expectedOutput = [
      new RepeatStatement(new Literal(10), [
        new PrintStatement(new Literal("hello")),
      ]),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse while statement correctly", () => {
    const input = `
      while true 
        print "infinite loop" 
      end
    `;

    const expectedOutput = [
      new WhileStatement(new Literal(true), [
        new PrintStatement(new Literal("infinite loop")),
      ]),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse nested if-else statement correctly", () => {
    const input = `
      if a <= 3 
        if a == 2 
          print "a is 2"
        end
      else
        print "a is greater than 3"
      end
    `;
    const expectedOutput = [
      new IfStatement(
        new Binary(
          new Variable(new Token(TokenType.IDENTIFIER, "a", null, 2)),
          new Token(TokenType.LESS_EQUAL, "<=", null, 2),
          new Literal(3)
        ),
        [
          new IfStatement(
            new Binary(
              new Variable(new Token(TokenType.IDENTIFIER, "a", null, 3)),
              new Token(TokenType.EQUAL_EQUAL, "==", null, 3),
              new Literal(2)
            ),
            [new PrintStatement(new Literal("a is 2"))]
          ),
        ],
        [new PrintStatement(new Literal("a is greater than 3"))]
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse if-else with else-if statement correctly", () => {
    const input = `
      if a <= 3 
        print "a is less than or equal to 3"
      else if a >= 0 
        print "a is greater than 0"
      else
        print "a is less than 0 or greater than 3"
      end
    `;
    const expectedOutput = [
      new IfStatement(
        new Binary(
          new Variable(new Token(TokenType.IDENTIFIER, "a", null, 2)),
          new Token(TokenType.LESS_EQUAL, "<=", null, 2),
          new Literal(3)
        ),
        [new PrintStatement(new Literal("a is less than or equal to 3"))],
        new IfStatement(
          new Binary(
            new Variable(new Token(TokenType.IDENTIFIER, "a", null, 4)),
            new Token(TokenType.GREATER_EQUAL, ">=", null, 4),
            new Literal(0)
          ),
          [new PrintStatement(new Literal("a is greater than 0"))],
          [
            new PrintStatement(
              new Literal("a is less than 0 or greater than 3")
            ),
          ]
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse if-else statement correctly", () => {
    const input = `
      if a <= 3 
        print "a is less than or equal to 3"
      else
        print "a is greater than 3"
      end
    `;
    const expectedOutput = [
      new IfStatement(
        new Binary(
          new Variable(new Token(TokenType.IDENTIFIER, "a", null, 2)),
          new Token(TokenType.LESS_EQUAL, "<=", null, 2),
          new Literal(3)
        ),
        [new PrintStatement(new Literal("a is less than or equal to 3"))],
        [new PrintStatement(new Literal("a is greater than 3"))]
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse if statement correctly", () => {
    const input = `
      if a <= 3 
        print "a is less than or equal to 3"
        set a = a + 1
      end
    `;
    const expectedOutput = [
      new IfStatement(
        new Binary(
          new Variable(new Token(TokenType.IDENTIFIER, "a", null, 2)),
          new Token(TokenType.LESS_EQUAL, "<=", null, 2),
          new Literal(3)
        ),
        [
          new PrintStatement(new Literal("a is less than or equal to 3")),
          new SetStatement(
            new Token(TokenType.IDENTIFIER, "a", null, 4),
            new Binary(
              new Variable(new Token(TokenType.IDENTIFIER, "a", null, 4)),
              new Token(TokenType.PLUS, "+", null, 4),
              new Literal(1)
            )
          ),
        ]
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse play statement correctly", () => {
    const input = `
      play note 3
      play note n for 2 secs
      play note n for 2s
    `;
    const expectedOutput = [
      new PlayStatement("note", new Literal(3)),
      new PlayStatement(
        "note",
        new Variable(new Token(TokenType.IDENTIFIER, "n", null, 3)),
        new Literal(2)
      ),
      new PlayStatement(
        "note",
        new Variable(new Token(TokenType.IDENTIFIER, "n", null, 4)),
        new Literal(2)
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse say statement correctly", () => {
    const input = `
      say name
      say "hello" for 2 secs
    `;
    const expectedOutput = [
      new SayStatement(
        new Variable(new Token(TokenType.IDENTIFIER, "name", null, 2))
      ),
      new SayStatement(new Literal("hello"), new Literal(2)),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse wait statement correctly", () => {
    const input = `wait t * 10 secs`;
    const expectedOutput = [
      new WaitStatement(
        new Binary(
          new Variable(new Token(TokenType.IDENTIFIER, "t", null, 1)),
          new Token(TokenType.STAR, "*", null, 1),
          new Literal(10)
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse print statement correctly", () => {
    const input = `print num + 10`;
    const expectedOutput = [
      new PrintStatement(
        new Binary(
          new Variable(new Token(TokenType.IDENTIFIER, "num", null, 1)),
          new Token(TokenType.PLUS, "+", null, 1),
          new Literal(10)
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse set statement correctly", () => {
    const input = `set name = "steve"`;
    const expectedOutput = [
      new SetStatement(
        new Token(TokenType.IDENTIFIER, "name", null, 1),
        new Literal("steve")
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should parse var statement correctly", () => {
    const input = `
      var str = "hello " + name
      var num
    `;
    const expectedOutput = [
      new VarStatement(
        new Token(TokenType.IDENTIFIER, "str", null, 2),
        new Binary(
          new Literal("hello "),
          new Token(TokenType.PLUS, "+", null, 2),
          new Variable(new Token(TokenType.IDENTIFIER, "name", null, 2))
        )
      ),
      new VarStatement(
        new Token(TokenType.IDENTIFIER, "num", null, 3),
        new Literal(null)
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  it("should skip new-line statement", () => {
    const input = `10\n\n\n\n\n20`;
    const expectedOutput = [
      new Expression(new Literal(10)),
      new Expression(new Literal(20)),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });
});

describe("parse expression statement", () => {
  test("multiple unary + and -", () => {
    const input = `++1\n--1`;
    const expectedOutput = [
      new Expression(
        new Unary(
          new Token(TokenType.PLUS, "+", null, 1),
          new Unary(new Token(TokenType.PLUS, "+", null, 1), new Literal(1))
        )
      ),
      new Expression(
        new Unary(
          new Token(TokenType.MINUS, "-", null, 2),
          new Unary(new Token(TokenType.MINUS, "-", null, 2), new Literal(1))
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("and, or operators", () => {
    const input = `true and false or true`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Binary(
            new Literal(true),
            new Token(TokenType.AND, "and", null, 1),
            new Literal(false)
          ),
          new Token(TokenType.OR, "or", null, 1),
          new Literal(true)
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("mod operator", () => {
    const input = `3 mod 2`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal(3),
          new Token(TokenType.MOD, "mod", null, 1),
          new Literal(2)
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("function call expression", () => {
    const input = `[random from 1 to 10]`;
    const expectedOutput = [
      new Expression(
        new FunctionCall(new Token(TokenType.IDENTIFIER, "random", null, 1), [
          new Variable(new Token(TokenType.IDENTIFIER, "from", null, 1)),
          new Literal(1),
          new Variable(new Token(TokenType.IDENTIFIER, "to", null, 1)),
          new Literal(10),
        ])
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("unary operator should have associativity from right to left", () => {
    const input = `!!!true`;
    const expectedOutput = [
      new Expression(
        new Unary(
          new Token(TokenType.NOT, "!", null, 1),
          new Unary(
            new Token(TokenType.NOT, "!", null, 1),
            new Unary(new Token(TokenType.NOT, "!", null, 1), new Literal(true))
          )
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("grouping should have higher precedence than binary and unary operators", () => {
    const input = `10 / -(10 + 10)`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal(10),
          new Token(TokenType.SLASH, "/", null, 1),
          new Unary(
            new Token(TokenType.MINUS, "-", null, 1),
            new Grouping(
              new Binary(
                new Literal(10),
                new Token(TokenType.PLUS, "+", null, 1),
                new Literal(10)
              )
            )
          )
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("unary operator shoud parse correctly with binary operator", () => {
    const input = `10 + -10`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal(10),
          new Token(TokenType.PLUS, "+", null, 1),
          new Unary(new Token(TokenType.MINUS, "-", null, 1), new Literal(10))
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("plus 2 string together should return AST correctly", () => {
    const input = `"hello" + "world"`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal("hello"),
          new Token(TokenType.PLUS, "+", null, 1),
          new Literal("world")
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });

  test("star operator (*) should have higher precedence than plus operator (+)", () => {
    const input = `1 + 2 * 3`;
    const expectedOutput = [
      new Expression(
        new Binary(
          new Literal(1),
          new Token(TokenType.PLUS, "+", null, 1),
          new Binary(
            new Literal(2),
            new Token(TokenType.STAR, "*", null, 1),
            new Literal(3)
          )
        )
      ),
    ];

    const scanner = new Scanner(input);
    const parser = new Parser(scanner.scanTokens());
    expect(parser.parse()).toEqual(expectedOutput);
  });
});

export default {};
