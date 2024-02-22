import { isBefore, isSameDay, format } from "date-fns";

export const formatSameDay = (date: Date) => {
  const now = new Date();

  if (isBefore(date, now) && isSameDay(now, date)) {
    return `Today`;
  }

  return format(date, "yyyy-MM-dd");
};
