/** Date.getDay()(0=일요일) → weekdayHours(월요일부터) 인덱스 매핑 */
const MONDAY_FIRST_INDEX_BY_DAY = [6, 0, 1, 2, 3, 4, 5];

export function getTodayHours(weekdayHours: string[]): string | undefined {
  if (weekdayHours.length !== 7) return undefined;
  return weekdayHours[MONDAY_FIRST_INDEX_BY_DAY[new Date().getDay()]];
}
