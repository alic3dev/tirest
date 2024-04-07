import {
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  differenceInCalendarYears,
} from 'date-fns'

export function cascadingDifferenceDisplay(
  dateLeft: Date,
  dateRight: Date,
): string {
  let timeSince: number | string = differenceInCalendarYears(
    dateLeft,
    dateRight,
  )

  if (timeSince) {
    timeSince = `${timeSince} year${timeSince > 1 ? 's' : ''}`
  } else {
    timeSince = differenceInCalendarMonths(dateLeft, dateRight)

    if (timeSince) {
      timeSince = `${timeSince} month${timeSince > 1 ? 's' : ''}`
    }
  }

  if (!timeSince) {
    timeSince = differenceInCalendarWeeks(dateLeft, dateRight)

    if (timeSince) {
      timeSince = `${timeSince} week${timeSince > 1 ? 's' : ''}`
    }
  }

  if (!timeSince) {
    timeSince = differenceInCalendarDays(dateLeft, dateRight)

    if (timeSince) {
      timeSince = `${timeSince} day${timeSince > 1 ? 's' : ''}`
    }
  }

  if (!timeSince) {
    timeSince = 'Today'
  }

  return `${timeSince}`
}
