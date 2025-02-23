export function urlJoin(...values: string[]) {
  // Join values with a single slash
  const merged = values
    .map((value) => {
      return value.replace(/^\/+/g, ""); // Remove leading
    })
    .join("/");

  // Regex to handle protocol part (http://, https://, etc.) without replacing double slashes
  return merged.replace(/(?<!:)\/\//g, "/");
}
