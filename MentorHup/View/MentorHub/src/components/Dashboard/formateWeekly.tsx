const FormateWeekly = (label: string) => {
  // Guard against undefined/empty labels
  if (!label || typeof label !== "string") {
    return "";
  }

  // Prefer the specific arrow delimiter; if not found, fall back to returning the original label
  const parts = label.split("→");
  if (parts.length !== 2) {
    return label;
  }

  const [startRaw, endRaw] = parts.map((s) => s.trim());

  const startDate = new Date(startRaw);
  const endDate = new Date(endRaw);

  // If dates are invalid, return the original label to avoid runtime errors
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return label;
  }

  const startFormatted = `${startDate.getDate()}/${startDate.getMonth() + 1}`;
  const endFormatted = `${endDate.getDate()}/${endDate.getMonth() + 1}`;

  return `${startFormatted} → ${endFormatted}`;
};

export default FormateWeekly;
