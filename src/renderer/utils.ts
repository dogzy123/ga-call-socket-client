function formatIsoToLocal(timestamp: string): string {
  const localDate = new Date(timestamp);

  // date and time like this: 20.02.2024 18:35:32
  // format month, day, hours, minutes and seconds to always have 0 in front of them if they are less than 10
  const month = `0${localDate.getMonth() + 1}`.slice(-2);
  const day = `0${localDate.getDate()}`.slice(-2);
  const hours = `0${localDate.getHours()}`.slice(-2);
  const minutes = `0${localDate.getMinutes()}`.slice(-2);
  const seconds = `0${localDate.getSeconds()}`.slice(-2);

  return `${day}.${month}.${localDate.getFullYear()} ${hours}:${minutes}:${seconds}`;
}

export { formatIsoToLocal };
