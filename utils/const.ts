import { Day } from '@prisma/client'

export const TIME_SLOTS = [
    { start: '9:10', end: '10:05' },
    { start: '10:05', end: '11:00' },
    { label: 'Tea Break', start: '11:00', end: '11:15', isBreak: true },
    { start: '11:15', end: '12:10' },
    { start: '12:10', end: '1:05' },
    { label: 'Lunch Break', start: '1:05', end: '1:35', isBreak: true },
    { start: '1:35', end: '2:30' },
    { start: '2:30', end: '3:25' },
    { start: '3:25', end: '4:20' },
  ]

export const WORKING_DAYS = [
    Day.MONDAY,
    Day.TUESDAY,
    Day.WEDNESDAY,
    Day.THURSDAY,
    Day.FRIDAY,
]