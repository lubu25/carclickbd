import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...input: any[]) {
  return twMerge(clsx(input));
}

export default cn;
