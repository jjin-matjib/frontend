export const searchKeys = {
  all: ["search"] as const,
  autocomplete: (query: string) =>
    [...searchKeys.all, "autocomplete", query] as const,
};
