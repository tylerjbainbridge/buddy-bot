import snoowrap from "snoowrap";
import AWS from "aws-sdk";
import SpeechToTextV1 from "ibm-watson/speech-to-text/v1";
import { IamAuthenticator } from "ibm-watson/auth";

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_S3_ACCESS_KEY;
AWS.config.secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;

export const polly = new AWS.Polly({
  signatureVersion: "v4",
  region: "us-east-1",
});

export const transcribe = new AWS.TranscribeService();

export const reddit = new snoowrap({
  userAgent: "official_jamie_bot 1.0",
  clientId: "cP1UQVDfFIXqlA",
  username: "official_jamie_bot",
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  password: process.env.REDDIT_PASSWORD,
});

export const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_API_KEY,
  }),
  url: "https://stream.watsonplatform.net/speech-to-text/api/v1/recognize",
});

export const WEATHER_APP_ID = "70da43007f50c4366fbb4685ffe5ef67";

export const BUDS_WITHOUT_COD = ["jam"];

export const BOT_TEST_CHANNEL_ID = "649013668373200929";

export const POLLY_VOICES = [
  "Joanna",
  "Kendra",
  "Kimberly",
  "Salli",
  "Joey",
  "Matthew",
  "Ivy",
  "Justin",
];
