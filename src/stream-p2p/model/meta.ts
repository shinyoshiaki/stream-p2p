export type Meta<T extends Type> = {
  name: string;
  type: T;
  payload: T extends "static" ? Static : "se";
};

export type Type = "static" | "stream";

type Static = { hash: string };

const test: Meta<"stream"> = {
  name: "a",
  type: "stream",
  payload: "se"
};
