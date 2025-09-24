const Duration = (s1: string, s2: string) => {
  const startTime = new Date(s1);
  const endTime = new Date(s2);

  const diff = endTime.getTime() - startTime.getTime();

  const diffHours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${diffHours} hour, ${diffMinutes} min`;
};

export default Duration;
