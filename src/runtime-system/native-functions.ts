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
