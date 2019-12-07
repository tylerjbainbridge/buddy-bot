export const test = async () => {
  voiceChannel.join().then(connection => {
    const receiver = connection.createReceiver();

    const stream = receiver.createPCMStream();

    const writeStream = fs.createWriteStream('test.raw_pcm');

    stream.pipe(writeStream);
  });
};
