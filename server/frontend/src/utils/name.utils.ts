export function titleToName(title: string): string {
  return title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9\-]/g, '');
}
