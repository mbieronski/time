// clock
export const NUM_CLOCKFACE_HOURS = 14;

export const BACKGROUND_COLOR = '#282c34'; // also need to change App.css

export const TIME = null; //new Date('2022-09-08T05:00:00.000');

/**
 * Know
 * current datetime 24
 * current time 28
 * current 24 day sunrise / sunset
 *
 * Show
 * which comes first (sunrise / sunset)
 * does the end (ie not first angle) need to be pushed a day?
 *
 *
 * ======================
 *
 * take time28 of 3 times
 *
 * we know current day28 and face
 * sunrise will either be on this day28/face, day28/prevFace, prevDay28/prevFace
 * sunset will either be on this day28/face, day28/nextFace, nextDay28/nextFace
 *
 * if sunrise is on prevFace (sunrise is before now and diff face), use sunset as start, bump sunrise 1 day
 *  else if sunrise on next face (surise is after now and diff face), use sunset -1 day as start
 *
 * if sunset is on nextFace (sunset is after now and diff face), use sunrise as end, start 0
 *  else if sunset on prevFace (sunset is before now and diff face), use sunrise + 1 and sunset + 1
 *
 * if neither 0 to sunrise, sunset to 0
 *
 * 1 sunset same day28, prev face/same
 * 2 sunset prev day28 , prev face
 * 3 sunsrise same day28, prev face/same
 * 4 sunrise next day28, prev face/same
 * 5 1 & 3
 * 6 2 & 4
 * 7 1 & 4
 * 8 2 & 3
 */
