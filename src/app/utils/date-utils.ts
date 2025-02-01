export const shiftDate=(date: Date|string, monthsShift: number) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + monthsShift);
  newDate.setHours(20);

  return newDate;
}
