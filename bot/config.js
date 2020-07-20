import snoowrap from 'snoowrap';
import AWS from 'aws-sdk';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';
import { IamAuthenticator } from 'ibm-watson/auth';
import { PrismaClient } from '@prisma/client';

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_S3_ACCESS_KEY;
AWS.config.secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

export const polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'us-east-1',
});

export const photon = new PrismaClient();

export const transcribe = new AWS.TranscribeService();

export const reddit = new snoowrap({
  userAgent: 'official_jamie_bot 1.0',
  clientId: 'cP1UQVDfFIXqlA',
  username: 'official_jamie_bot',
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  password: process.env.REDDIT_PASSWORD,
});

export const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY,
  }),
  url: 'https://stream.watsonplatform.net/speech-to-text/api/v1/recognize',
});

export const WEATHER_APP_ID = '70da43007f50c4366fbb4685ffe5ef67';

export const BUDS_WITHOUT_COD = ['jam'];

export const BOT_TEST_CHANNEL_ID = '649013668373200929';

export const POLLY_VOICES = [
  'Justin',
  'Nicole',
  'Enrique',
  'Tatyana',
  'Russell',
  'Lotte',
  'Geraint',
  'Carmen',
  'Mads',
  'Penelope',
  'Mia',
  'Joanna',
  'Matthew',
  'Brian',
  'Seoyeon',
  'Ruben',
  'Ricardo',
  'Maxim',
  'Lea',
  'Giorgio',
  'Carla',
  'Naja',
  'Maja',
  'Astrid',
  'Ivy',
  'Kimberly',
  'Chantal',
  'Amy',
  'Vicki',
  'Marlene',
  'Ewa',
  'Conchita',
  'Camila',
  'Karl',
  'Zeina',
  'Miguel',
  'Mathieu',
  'Lucia',
  'Jacek',
  'Bianca',
  'Takumi',
  'Ines',
  'Gwyneth',
  'Cristiano',
  'Mizuki',
  'Celine',
  'Zhiyu',
  'Jan',
  'Liv',
  'Joey',
  'Raveena',
  'Filiz',
  'Dora',
  'Salli',
  'Aditi',
  'Vitoria',
  'Emma',
  'Lupe',
  'Hans',
  'Kendra',
];
