export default async function* iterateStream(stream) {
  if (stream.readableEnded) {
    return;
  }

  const contents = [];
  let ended = false;
  let error = null;
  let waitResolve = null;

  const wakeUp = () => {
    if (waitResolve) {
      const resolve = waitResolve;
      waitResolve = null;
      resolve();
    }
  };

  const onData = data => {
    contents.push(data);
    wakeUp();
  };

  const onEnd = () => {
    ended = true;
    wakeUp();
  };

  const onError = err => {
    error = err;
    wakeUp();
  };

  const onClose = () => {
    ended = true;
    wakeUp();
  };

  const waitForNextEvent = () =>
    new Promise(resolve => {
      waitResolve = resolve;
      stream.resume();
      if (contents.length > 0 || ended || error) {
        wakeUp();
      }
    });

  // Register terminal listeners before 'data' so synchronous emissions on 'data' attachment are not missed
  stream.once('end', onEnd);
  stream.once('error', onError);
  stream.once('close', onClose);
  stream.on('data', onData);

  try {
    while (!ended || contents.length > 0) {
      if (error) {
        throw error;
      }
      if (contents.length > 0) {
        yield contents.shift();
      } else {
        await waitForNextEvent();
      }
    }
    if (error) {
      throw error;
    }
  } finally {
    stream.removeListener('data', onData);
    stream.removeListener('end', onEnd);
    stream.removeListener('error', onError);
    stream.removeListener('close', onClose);
  }
}
