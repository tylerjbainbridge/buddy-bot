import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
// import micStream from 'line-in';
// import Speaker from 'speaker';
// import fs from 'fs';

// import Mic from 'node-microphone';

export const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY
  }),
  url: 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize'
});

export const test = (voiceChannel, user) =>
  new Promise(async resolve => {
    {
      // const mic = new Mic();
      // const micStream = mic.startRecording();

      // const speaker = new Speaker({
      //   channels: 1,
      //   bitDepth: 16,
      //   sampleRate: 16000
      // });

      // micStream.pipe(speaker);

      const connection = await voiceChannel.join();

      const receiver = connection.createReceiver();

      console.log('listening to user', user);

      const pcmStream = receiver.createPCMStream(user);

      pcpStream.on('data', () => {
        console.log('user speaking!');
      });

      // create the stream
      const recognizeStream = speechToText.recognizeUsingWebSocket({
        // contentType: 'audio/wav',
        contentType: 'audio/l16;rate=48000;channels=1',
        interimResults: true,
        inactivityTimeout: -1
      });

      pcmStream.pipe(recognizeStream);

      // // pipe in some audio
      // fs.createReadStream(__dirname + '/test.wav').pipe(recognizeStream);

      recognizeStream.on('data', function(event) {
        onEvent('Data:', event.toString());
        resolve();
      });

      recognizeStream.on('error', function(event) {
        onEvent('Error:', event);
      });

      recognizeStream.on('close', function(event) {
        onEvent('Close:', event);
        resolve();
      });

      // Displays events on the console.
      function onEvent(name, event) {
        console.log(name, JSON.stringify(event, null, 2));
      }
    }
  });
