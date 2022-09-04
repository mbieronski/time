import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import GoogleButton from '../../components/GoogleButton';
import Calendar from './components/Calendar';

import '../../App.css';

function CalendarPage() {
  const [calendarData, setCalendarData] =
    useState<gapi.client.calendar.Events>(null);
  return (
    <main className="App" style={{ display: 'block' }}>
      <div
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingTop: '15px',
        }}
      >
        <div
          id="page_header"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              &#60; back
            </Link>
          </div>

          <p style={{ flex: 1, fontWeight: 'bold' }} />
          <span style={{ flex: 1 }}>
            <GoogleButton setData={setCalendarData} />
          </span>
        </div>
      </div>
      <Calendar data={calendarData} />
    </main>
  );
}

export default CalendarPage;
