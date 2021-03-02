# score-language

TODO: Add description

## Context-free Grammar

> Version number: 1.0

```sh
program → statement* EOF

statement → exprStmt
	| printStmt
	| ifStmt
	| whileStmt
	| repeatStmt
	| varStmt
	| setStmt
	| sayStmt
	| waitStmt
	| playStmt
	| "\n"
exprStmt → expression "\n"
printStmt → "print" expression "\n"
ifStmt → "if" expression "then" "\n" statement* "end" "\n"
	| "if" expression "then" "\n" statement* "else" "\n" statement* "end" "\n"
	| "if" expression "then" "\n" statement* "else" ifStmt
whileStmt → "while" expression "then" "\n" statement* "end" "\n"
repeatStmt → "repeat" expression "times" "then" "\n" statement* "end" "\n"
varStmt → "var" ID ("=" expression)? "\n"
setStmt → "set" ID "=" expression "\n"
sayStmt → "say" expression (ID["for"] expression ID["secs"])? "\n"
waitStmt → "wait" expression ID["secs"] "\n"
playStmt → "play" ID["note"] expression (ID["for"] expression ID["secs"])? "\n"

expression → logic_or
logic_or → logic_and ("or" logic_and)*
logic_and → equality ("and" equality)*
equality → comparison (( "!=" | "==" ) comparison)*
comparison → term (( ">" | ">=" | "<" | "<=" ) term)*
term → factor (( "-" | "+" ) factor)*
factor → unary (( "/" | "*" | "mod" ) unary)*
unary → ( "not" | "-" | "+" ) unary | primary | functionCall
functionCall → "[" functionName arguments? "]"
functionName → ID
arguments → expression*
primary → NUMBER
	| STRING
	| "number" | "string" | "boolean"
	| "true" | "false"
	| "null"
	| "(" expression ")"
	| ID
```
