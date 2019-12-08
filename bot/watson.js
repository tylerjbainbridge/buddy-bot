// import micStream from 'line-in';
// import Speaker from 'speaker';

import { findByUsername } from './utils';

// import Mic from 'node-microphone';

export const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY
  }),
  url: 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize'
});
