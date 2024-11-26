import { add } from 'date-fns';

export function convertUSToIST(date: Date): Date {
    // India time = UTC + 5:30 (5.5 hours ahead of UTC)
    const todayDate = new Date();

    todayDate.setTime(date.getTime());

    // Add 5 hours and 30 minutes to the UTC date using date-fns
    const istDate = add(todayDate, { hours: 5, minutes: 30 });

    return istDate;
}

export function formatTime (sT: Date, eT: Date) {
    //India time = UTC + 5:30 ( 5.30 ghante aage than database time)
    const startDate = convertUSToIST(sT);
    const endDate = convertUSToIST(eT);
  
    // Format times to match TIME_SLOTS exactly
    const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  
    return {startTime, endTime}
}