const types = [
  "Expression || expression: Expr",
  "VarStatement || name: Token, initializer: Expr",
  "SetStatement || name: Token, value: Expr",
  "WaitStatement || duration: Expr",
  "PrintStatement || value: Expr",
  "SayStatement || value: Expr, duration?: Expr",
  'PlayStatement || type: "note", value: Expr, duration?: Expr',
  "ExitStatement || empty",
  "IfStatement || test: Expr, consequent: Stmt[], alternate?: IfStatement | Stmt[]",
  "WhileStatement || test: Expr, body: Stmt[]",
  "RepeatStatement || n: Expr, body: Stmt[]",
  "BreakStatement || empty",
  "ContinueStatement || empty",
];

function defineAst(baseName, types) {
  // define visitor
  console.log(`export interface ${baseName}Visitor<R> {
    ${types
      .map((x) => x.split("||")[0].trim())
      .map((type) => `visit${type}${baseName}(stmt: ${type}): R;`)
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
  const name = type.split("||")[0].trim();
  const argStr = type.split("||")[1].trim();
  const args = argStr
    .split(",")
    .map((x) => x.trim())
    .map((x) => x.split(":").map((y) => y.trim()));

  const constructor = `
    ${args.map((x) => `readonly ${x[0]}: ${x[1]};`).join("\n")}
  
    constructor(${argStr}) {
      ${args
        .map((x) => `this.${x[0].replace("?", "")} = ${x[0].replace("?", "")};`)
        .join("\n")}
    }
  `;

  console.log(`export class ${name} implements ${baseName} {
    ${JSON.stringify(args).includes("empty") ? "" : constructor}

    accept<R>(visitor: ${baseName}Visitor<R>): R {
      return visitor.visit${name}${baseName}(this);
    }
  }\n\n`);
}

console.log(`import { Token } from "./Token";
import { Expr } from "./Expr";
`);
defineAst("Stmt", types);
