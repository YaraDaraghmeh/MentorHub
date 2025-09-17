const FormateWeekly = (label: string) => {
  const [start, end] = label.split("→");

  const startDate = new Date(start);
  const endDate = new Date(end);

  const startFormatted = `${startDate.getDate()}/${startDate.getMonth() + 1}`;
  const endFormatted = `${endDate.getDate()}/${endDate.getMonth() + 1}`;

  return `${startFormatted} → ${endFormatted}`;
};

export default FormateWeekly;
