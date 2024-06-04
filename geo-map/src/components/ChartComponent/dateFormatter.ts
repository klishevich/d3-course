export function dateFormatter(date: number): string {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
    // hour: "2-digit",
    // minute: "2-digit"
  });
}
