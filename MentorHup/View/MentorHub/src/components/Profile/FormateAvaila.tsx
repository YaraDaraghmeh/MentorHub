export const day = (dayAva: string) => {
  const newDay = dayAva.slice(0, 3);

  return newDay;
};

export const time = (startTime: string, endTime: string) => {
  const formateTime = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const dis = `${formateTime(startTime)} - ${formateTime(endTime)}`;

  return dis;
};
