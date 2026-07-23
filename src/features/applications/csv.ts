type CsvPrimitive = Date | number | string | null | undefined;

export function escapeCsvValue(value: CsvPrimitive) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function rowsToCsv(headers: string[], rows: CsvPrimitive[][]) {
  return [headers, ...rows].map((row) => row.map(escapeCsvValue).join(",")).join("\n");
}
