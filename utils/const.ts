import { Day } from '@prisma/client'

export const TIME_SLOTS = [
    { start: '09:10', end: '10:05' },
    { start: '10:05', end: '11:00' },
    { start: '11:15', end: '12:10' },
    { start: '12:10', end: '01:05' },
    { start: '01:35', end: '02:30' },
    { start: '02:30', end: '03:25' },
    { start: '03:25', end: '04:20' },
  ]

export const WORKING_DAYS = [
    Day.MONDAY,
    Day.TUESDAY,
    Day.WEDNESDAY,
    Day.THURSDAY,
    Day.FRIDAY,
]