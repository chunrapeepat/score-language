import { InvalidArgumentError } from "./Error";

interface RandomParams {
  from: number;
  to: number;
}
export const random = ({ from, to }: RandomParams) => {
  if (typeof from !== "number" || typeof to !== "number") {
    throw new InvalidArgumentError("random function");
  }
  const min = Math.min(from, to);
  const max = Math.max(from, to);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

interface AskParams {
  object: any;
  type?: "type_string" | "type_boolean" | "type_number";
}
export const ask = ({ object, type }: AskParams) => {
  let input = window.prompt(String(object));
  let result: any = input;
  if (type === "type_string") {
    result = String(input);
  }
  if (type === "type_boolean") {
    result = Boolean(input);
  }
  if (type === "type_number") {
    result = Number(input);
  }

  if (Number.isNaN(result)) {
    throw new Error(`can't convert "${input}" to type number`);
  }

  return result;
};
