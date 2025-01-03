export const getDateFromISOString = (date: string) => {
  return new Date(date).toLocaleString();
};

export const prettyDateTime = (date: string) => {
  // Examples:
  // Tomorrow, 10:00 AM
  // Today, 10:00 PM
  // Yesterday, 10:00 AM
  // 10/10/2021, 10:00 AM
  const d = new Date(date);
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  const options = {
    hour: "numeric",
    minute: "numeric",
  } as Intl.DateTimeFormatOptions;
  const time = d.toLocaleTimeString("en-US", options);

  if (isToday) {
    return `Today, ${time}`;
  } else if (isTomorrow) {
    return `Tomorrow, ${time}`;
  } else if (isYesterday) {
    return `Yesterday, ${time}`;
  } else {
    return `${d.toLocaleDateString()}, ${time}`;
  }
};
