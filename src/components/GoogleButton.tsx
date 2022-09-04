import React, { useCallback, useEffect } from 'react';
import { GoogleLogin, GoogleLoginResponse } from 'react-google-login';
import { gapi } from 'gapi-script';
import { getStartWeek } from '../utils/getStartWeek';
import { getEndWeek } from '../utils/getEndWeek';
import { TIME } from '../constants';

const clientId =
  '918113900716-tdh38u2sdk0c7ikhmnpf540k5jke7f9d.apps.googleusercontent.com';

const scope = 'https://www.googleapis.com/auth/calendar.events.readonly';

type GoogleButtonProps = {
  setData: (data: gapi.client.calendar.Events) => void;
};

function GoogleButton(props: GoogleButtonProps) {
  const { setData } = props;

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId,
        scope,
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  const onSuccess = useCallback(
    async (res: GoogleLoginResponse) => {
      gapi.client.load('calendar', 'v3', async () => {
        const request = {
          calendarId: 'primary',
          timeMin: getStartWeek(TIME || new Date()).toISOString(),
          timeMax: getEndWeek(TIME || new Date()).toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 100,
        };

        const response = await gapi.client.calendar.events.list(request);
        setData(response.result);
      });
    },
    [setData],
  );

  return (
    <GoogleLogin
      clientId={clientId}
      buttonText="Sign in with Google"
      onSuccess={onSuccess}
      onFailure={() => alert('failed')}
      cookiePolicy={'single_host_origin'}
      isSignedIn={false}
    />
  );
}

export default GoogleButton;
