import React, { useMemo, useState } from 'react';
import Modal from 'react-modal';
import map from 'lodash/map';
import range from 'lodash/range';
import padEnd from 'lodash/padEnd';

import { toTime28 } from '../../../utils/toTime28';
import '../../../App.css';
import './Calendar.css';
import moment from 'moment';
import ModalItem from './ModalItem';

// alias
type CalendarEvent = gapi.client.calendar.Event;

type CalendarProps = {
  data?: gapi.client.calendar.Events;
};

function Calendar(props: CalendarProps) {
  const { data } = props;

  const [focusedEvent, setFocusedEvent] = useState<CalendarEvent>(null);

  const eventMap = useMemo(() => {
    console.log(data);

    const calendarEvents: Record<string, Record<string, CalendarEvent>> = {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
    };

    map(data?.items, (event) => {
      // for all day events you only get a date, moment()
      // will convert to utc and utc() will roll it back to midnight
      const startTime28 = toTime28(
        new Date(
          event.start.dateTime || moment(event.start.date).utc().toDate(),
        ),
      );

      calendarEvents[startTime28.day][
        `${startTime28.hour}${padEnd(startTime28.minute + '', 2, '0')}`
      ] = event;
    });

    return calendarEvents;
  }, [data]);

  return (
    <div>
      <h2>This Week</h2>
      <div className="calendar">
        {map(range(0, 56), (timeWindow) => {
          return map(range(0, 7), (i) => {
            const hour = Math.floor(timeWindow / 2);
            const halfHour = timeWindow % 2 ? '30' : '00';
            if (!i)
              return (
                <div
                  id={hour + halfHour}
                  className="cell-time-slot"
                >{`${hour}:${halfHour}`}</div>
              );

            const event = eventMap[i - 1][hour + halfHour];
            if (event) {
              return (
                <div
                  className="cell-slot"
                  style={{
                    gridColumn: `day-${i - 1}`,
                    gridRow: `time-${hour + halfHour}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => setFocusedEvent(event)}
                >
                  {event.summary}
                </div>
              );
            }
            return (
              <div
                id={`${timeWindow + i}`}
                className="cell-slot"
                style={{ gridColumn: `day-${i - 1}` }}
              >{``}</div>
            );
          });
        })}
        <Modal
          isOpen={!!focusedEvent}
          // onAfterOpen={afterOpenModal}
          onRequestClose={() => setFocusedEvent(null)}
          style={{
            content: {
              width: '30%',
              height: '80%',
              left: '35%',
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'column',
            },
          }}
          contentLabel="Calendar Event"
          shouldCloseOnOverlayClick={false}
        >
          <h2>{focusedEvent?.summary}</h2>
          <ModalItem
            title="Start Time"
            content={
              toTime28(
                new Date(
                  focusedEvent?.start.dateTime ||
                    moment(focusedEvent?.start.date).utc().toDate(),
                ),
              ).formatted
            }
          />
          <ModalItem
            title="End Time"
            content={
              toTime28(
                new Date(
                  focusedEvent?.end.dateTime ||
                    moment(focusedEvent?.end.date).utc().toDate(),
                ),
              ).formatted
            }
          />
          <ModalItem title="Location" content={focusedEvent?.location} />
          <ModalItem title="Description" content={focusedEvent?.description} />
          <button
            style={{
              position: 'absolute',
              left: '25%',
              bottom: 20,
              width: '50%',
            }}
            onClick={() => setFocusedEvent(null)}
          >
            close
          </button>
        </Modal>

        {/* <div className="session session-1 track-1">
          <h4 className="session-title">
            <a>Session Title</a>
          </h4>
          <span className="session-time">8:00am - 9:00am</span>
          <span
            className="session-track"
            style={{
              gridColumn: 'track-1',
              gridRow: 'time-0800 / time-0830',
            }}
          >
            Track 1
          </span>
          <span className="session-presenter">Presenter Name</span>
        </div>

        <h3 className="time-slot">9:00am</h3>
        <div className="session session-5 track-1">
          <h4 className="session-title">
            <a>Session Title</a>
          </h4>
          <span className="session-time">9:00am - 10:00am</span>
          <span className="session-track">Track 1</span>
          <span className="session-presenter">Presenter Name</span>
        </div> */}
      </div>
    </div>
  );
}

export default Calendar;
