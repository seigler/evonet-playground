require('dotenv-safe').config();
const dash = require('dash');
const player = require('play-sound')(opts = {});
const notifier = require('node-notifier');
const request = require('request');

const sdkOpts = {
  network: 'testnet'
};
const sdk = new dash.SDK(sdkOpts);

(async function () {
  let platform = sdk.platform;
  await sdk.isReady();

  let lastCount = 0;
  while(true) {
    let documents;
    let usernames = [];
    let startAt = lastCount;
    do {
      let retry = true;
      do {
        try {
          documents = await platform.documents.get('dpns.domain', { startAt });
          retry = false;
        } catch (e) {
          console.error(e.metadata);
          await new Promise(r => setTimeout(r, 2000));
        }
      } while (retry);
      usernames = usernames.concat(
        documents.map(d => ({
          label: d.data.normalizedLabel,
          domain: d.data.normalizedParentDomainName,
          id: d.userId
        }))
      );
      startAt += 100;
    } while (documents.length == 100);

    if (lastCount === 0) {
      usernames.forEach(u => console.log(`${u.label}${
        u.domain === '' ? '' : '.' + u.domain
      }\t${u.id}`));
      const uniqueIds = usernames.map(x => x.id).filter(
        (val, i, arr) => (arr.indexOf(val) === i)
      ).length;
      const domains = usernames.filter(
        u => u.domain === ''
      ).length;
      console.log(`Total ${usernames.length - domains} names and ${domains} domain${domains > 1 ? 's' : ''} registered, representing ${uniqueIds} unique IDs.`);
    } else {
      if (usernames.length > 0) {
        createNotification(usernames);
      }
    }
    lastCount += usernames.length;
    await new Promise(r => setTimeout(r, 60 * 1000));
  }
})();

function createNotification(newNames) {
  const names = newNames.map(n => `${n.label}.${n.domain} - ${n.id}`);
  const message = (names.length > 1 ?
    'New users:\n* ' + names.join('\n* ') :
    'New user: ' + names[0]
  );
  console.log(message);
  player.play('notify.mp3', function(err){ if (err) throw err; });
  if (process.env.SLACKWEBHOOK) {
    request.post(
      process.env.SLACKWEBHOOK,
      { json: { "text": message } },
      function (error, response, body) {
        if (error) {
          console.error(error);
          console.dir(response);
        }
      }
    );
  } else {
    notifier.notify({
      title: 'EvoNet monitor',
      message
    });
  }
}
