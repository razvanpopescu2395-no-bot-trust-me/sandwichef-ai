export interface StoreStatus {
  isOpen: boolean;
  statusTextRo: string;
  statusTextEn: string;
  statusTextIt: string;
  subtextRo: string;
  subtextEn: string;
  subtextIt: string;
}

export function getStoreStatus(): StoreStatus {
  try {
    // Craiova is in Europe/Bucharest timezone (UTC+2 or UTC+3 DST)
    const now = new Date();
    const roTimeStr = now.toLocaleString('en-US', { timeZone: 'Europe/Bucharest' });
    const roDate = new Date(roTimeStr);
    const day = roDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hours = roDate.getHours();
    const minutes = roDate.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const openMinutes = 9 * 60 + 30; // 09:30
    const closeMinutes = 17 * 60 + 30; // 17:30

    // Monday (1) to Friday (5)
    const isWeekday = day >= 1 && day <= 5;
    const isWithinHours = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    if (isWeekday && isWithinHours) {
      const remainingMinutes = closeMinutes - currentMinutes;
      const hoursLeft = Math.floor(remainingMinutes / 60);
      const minsLeft = remainingMinutes % 60;

      return {
        isOpen: true,
        statusTextRo: 'Deschis acum în Craiova',
        statusTextEn: 'Open Now in Craiova',
        statusTextIt: 'Aperto ora a Craiova',
        subtextRo: `Închidem la 17:30 (în ${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minsLeft} min)`,
        subtextEn: `Closes at 17:30 (in ${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minsLeft} min)`,
        subtextIt: `Chiude alle 17:30 (tra ${hoursLeft > 0 ? `${hoursLeft}h ` : ''}${minsLeft} min)`,
      };
    } else {
      let nextOpen = 'Luni la 09:30';
      let nextOpenEn = 'Monday at 09:30';
      let nextOpenIt = 'Lunedì alle 09:30';
      if (isWeekday && currentMinutes < openMinutes) {
        nextOpen = 'Azi la 09:30';
        nextOpenEn = 'Today at 09:30';
        nextOpenIt = 'Oggi alle 09:30';
      }

      return {
        isOpen: false,
        statusTextRo: 'Momentan închis',
        statusTextEn: 'Currently Closed',
        statusTextIt: 'Attualmente chiuso',
        subtextRo: `Deschidem ${nextOpen} (Str. Amaradia 29)`,
        subtextEn: `Opens ${nextOpenEn} (Amaradia St. 29)`,
        subtextIt: `Apre ${nextOpenIt} (Via Amaradia 29)`,
      };
    }
  } catch (e) {
    return {
      isOpen: true,
      statusTextRo: 'Deschis: Luni - Vineri 09:30 - 17:30',
      statusTextEn: 'Open: Mon - Fri 09:30 - 17:30',
      statusTextIt: 'Aperto: Lun - Ven 09:30 - 17:30',
      subtextRo: 'Str. Amaradia, Nr. 29, Craiova',
      subtextEn: '29 Amaradia St., Craiova',
      subtextIt: 'Via Amaradia, N. 29, Craiova',
    };
  }
}
