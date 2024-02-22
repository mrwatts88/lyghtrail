import { Fetcher } from "swr";

export const fetcher: Fetcher = async (...args: Parameters<typeof fetch>) => {
  return (await fetch(...args)).json();
};
