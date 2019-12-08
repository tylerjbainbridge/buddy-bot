import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
// import micStream from 'line-in';
// import Speaker from 'speaker';
import fs from 'fs';

import { findByUsername } from './utils';

// import Mic from 'node-microphone';

export const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY
  }),
  url: 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize'
});

export const test = (voiceChannel, meta) =>
  new Promise(async resolve => {
    const user = findByUsername(meta.client.users, 'tyler');

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

      console.log('listening to user', user);

      // 16-bit signed PCM, stereo 48KHz stream
      const pcmStream = connection.receiver.createStream(user, {
        mode: 'pcm',
        end: 'manual'
      });

      // pcmStream.pipe(fs.createWriteStream(__dirname + `/${Date.now()}.pcm`));

      meta.msg.channel.send('listening...');

      // create the stream
      const recognizeStream = speechToText.recognizeUsingWebSocket({
        // contentType: 'audio/ogg;codecs=opus',
        model: 'en-US_BroadbandModel',
        // objectMode: true,
        contentType: 'audio/l16;rate=48000;channels=2',
        interimResults: true,
        inactivityTimeout: -1
      });

      pcmStream.pipe(recognizeStream);

      pcmStream.on('data', () => {
        console.log('user speaking!');
      });

      pcmStream.on('error', function(event) {
        console.log('uh oh!');
      });

      pcmStream.on('close', function(event) {
        console.log('user is DONE speaking');
      });

      // // pipe in some audio
      // fs.createReadStream(__dirname + '/test.wav').pipe(recognizeStream);

      recognizeStream.on('data', function(event) {
        const text = event.toString();

        onEvent('Data:', text);

        meta.msg.channel.send(`I heard you say: ${text}`);

        resolve(text);

        pcmStream.destroy();
      });

      recognizeStream.on('error', function(event) {
        onEvent('Error:', event);
      });

      recognizeStream.on('close', function(event) {
        onEvent('Close:', event);
        // resolve();
      });

      // Displays events on the console.
      function onEvent(name, event) {
        console.log(name, JSON.stringify(event, null, 2));
      }
    }
  });
