const types = [
  "Binary | left: Expr, operator: Token, right: Expr",
  "Grouping | expression: Expr",
  "Literal | value: any",
  "Unary | operator: Token, right: Expr",
  "ExplicitType | type: TokenType",
  "Variable | name: Token",
  "FunctionCall | name: Token, args: Expr[]",
];

function defineAst(baseName, types) {
  // define visitor
  console.log(`export interface ${baseName}Visitor<R> {
    ${types
      .map((x) => x.split("|")[0].trim())
      .map((type) => `visit${type}${baseName}(expr: ${type}): R;`)
      .join("\n")}
  }`);

  console.log(`export interface ${baseName} {
    accept<R>(visitor: ${baseName}Visitor<R>): R;
  }\n\n`);

  types.forEach((type) => {
    defineType(baseName, type);
  });
}

function defineType(baseName, type) {
  const name = type.split("|")[0].trim();
  const argStr = type.split("|")[1].trim();
  const args = argStr
    .split(",")
    .map((x) => x.trim())
    .map((x) => x.split(":").map((y) => y.trim()));

  console.log(`export class ${name} implements ${baseName} {
    ${args.map((x) => `readonly ${x[0]}: ${x[1]};`).join("\n")}
  
    constructor(${argStr}) {
      ${args.map((x) => `this.${x[0]} = ${x[0]};`).join("\n")}
    }

    accept<R>(visitor: ${baseName}Visitor<R>): R {
      return visitor.visit${name}${baseName}(this);
    }
  }\n\n`);
}

console.log(`import { Token } from "./Token";
import { TokenType } from "./TokenType";`);
defineAst("Expr", types);
