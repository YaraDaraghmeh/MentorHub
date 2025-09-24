const FormatTime = (datetime: string) => {
  if (!datetime) return "";
  const date = new Date(datetime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default FormatTime;
