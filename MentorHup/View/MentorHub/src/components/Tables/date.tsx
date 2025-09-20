const FormateDate = (date: string) => {
  // Guard against undefined/empty dates
  if (!date || typeof date !== "string") {
    return "";
  }

  // Prefer the specific arrow delimiter; if not found, fall back to returning the original date
  const parts = date.split("T");
  if (parts.length !== 2) {
    return date;
  }

  const [startRaw] = parts.map((s) => s.trim());

  const newDate = new Date(startRaw);

  const startFormatted = `${newDate.getDate()}.${
    newDate.getMonth() + 1
  }.${newDate.getFullYear()}`;

  return `${startFormatted}`;
};

export default FormateDate;
