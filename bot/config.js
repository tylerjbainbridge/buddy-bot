import snoowrap from 'snoowrap';

export const reddit = new snoowrap({
  userAgent: 'official_jamie_bot 1.0',
  clientId: 'cP1UQVDfFIXqlA',
  username: 'official_jamie_bot',
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  password: process.env.REDDIT_PASSWORD
});

export const WEATHER_APP_ID = '70da43007f50c4366fbb4685ffe5ef67';

export const BUDS_WITHOUT_COD = ['jam'];
