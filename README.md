# Score Programming Language

Score is a programming language designed for blind and visually impaired students as an educational tool to learn to code targeted primarily on primary and middle schools

> Fun fact: Score (or an alternative term for "sheet music") is a handwritten or printed form of musical notation that uses musical symbols to indicate the pitches, rhythms, or chords of a song or instrumental musical piece

### Why was "Score" developed?

- Much of the CS education tools for kid relies on visual representation and are not support screen reader software such as Scratch programming language
- Text-based programming in languages with traditional syntax (e.g. C++, Java, Javascript, or Python’s whitespace rules) are difficult to understand through audio
- There were no educational programs for blind and visually impaired students to learn to code in Thailand

### The Language Objectives

- Be an educational tool for teachers to teach coding in classroom for blind and visually impaired students
- Students can use their programming knowledges to build small game e.g. Q&A game, or play a music with musical note e.g. happy birthday song

### Language Design Principle

- Every instruction should be readable like an English sentence
- No indentation and whitespace required

### Future Improvement

- Setting customization such as voice or musical instrument
- Array data structure
- Load and play custom audio file
- Event listener
- Function declaration
- Global variable for multiple scripts

## Language Features

### A. Variables

#### Variable declaration

```
var name = "Chun Rapeepat"
var bool = true
var score = 25.25
```

#### Variable reassignment

```
set score = 500;
```

### B. Operators

#### Mathematical operators

```
var a = -10;
var b = 10 + 20;
var c = 10 - 20;
var d = 10 * 20;
var e = 10 / 20;
var f = (5 mod 2) + 10;
```

#### String concatenation

```
var name = "Chun"
var msg = "hello " + name
```

#### Logical operators

```
var a = true and false
var b = true of false
var c = not true
```

#### Comparison operators

```
var less = 10 < 20
var greater = 30 > 20
var lessThanOrEqualTo = 10 <= 10
var greaterThanOrEqualTo = 10 >= 10
var notEqual = 1 != 2
```

### C. Control Flow

#### If statement

```
var num = 10
if num < 100 then
    print "num is less than 100"
end
```

#### If-else statement

```
var num = 10
if num < 100 then
    print "num is less than 100"
else
    print "num is greater than or equal to 100"
end
```

#### If-else else-if statement

```
var num = 10
if num < 100 then
    print "num is less than 100"
else if num == 100 then
    print "num is equal to 100"
else
    print "num is greater than 100"
end
```

#### While statement

```
var a = 1
while a <= 10 then
    print a
    set a = a + 1
end
```

#### Repeat statement

```
repeat 10 times then
    print "hi!"
end
```

### D. Statements

#### Print statement

```
var name = "Chun"

# the result will print to the screen
print "Hello my name is " + name
```

#### Say statement

```
# the result will produce via audio output
say "hello"
```

#### Play statement

```
# play note 1 in C#major chromatic scale
play note 1

# play note 1 in C#major chromatic scale in the next octave
play note 1 + 12

# play note 1 for 3 seconds
play note 1 for 3 secs
```

```
var n = 1
repeat 50 times then
    play note n for 0.2 secs
    set n = n + 1
end
```

#### Wait statement

```
print "hello"

wait 3 secs

print "world"
```

#### Exit program statement

```
print "start program"

exit program

print "this line should not be executed"
```

## Context-free Grammar

> Version: 1.0

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
	| exitStmt
	| breakStmt
	| continueStmt
	| "\n"
exprStmt → expression "\n"
printStmt → "print" expression "\n"
ifStmt → "if" expression "then" "\n" statement* "end" "\n"
	| "if" expression "then" "\n" statement* "else" "\n" statement* "end" "\n"
	| "if" expression "then" "\n" statement* "else" ifStmt
whileStmt → "while" expression "then" "\n" statement* "end" "\n"
repeatStmt → "repeat" expression ID["times"] "then" "\n" statement* "end" "\n"
breakStmt → "break" "\n"
continueStmt → "continue" "\n"
varStmt → "var" ID ("=" expression)? "\n"
setStmt → "set" ID "=" expression "\n"
sayStmt → "say" expression (ID["for"] expression ID["secs"])? "\n"
waitStmt → "wait" expression ID["secs"] "\n"
playStmt → "play" ID["note"] expression (ID["for"] expression ID["secs"])? "\n"
exitStmt → "exit" "\n"

expression → logic_or
logic_or → logic_and ("or" logic_and)*
logic_and → equality ("and" equality)*
equality → comparison (( "!=" | "==" ) comparison)*
comparison → term (( ">" | ">=" | "<" | "<=" ) term)*
term → factor (( "-" | "+" ) factor)*
factor → unary (( "/" | "*" | "mod" ) unary)*
unary → ( "not" | "-" | "+" ) unary | primary | functionCall
functionCall → "[" ID expression* "]"
primary → NUMBER
	| STRING
	| "number" | "string" | "boolean"
	| "true" | "false"
	| "null"
	| "(" expression ")"
	| ID
```

---

Made with :sparkling_heart: by [Chun Rapeepat](https://thechun.dev)
