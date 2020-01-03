require('dotenv').config();
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

  let prevUsernames = null;

  while(true) {
    const documents = await platform.documents.get('dpns.domain', {
      where: [[
        'normalizedParentDomainName', '==', 'dash'
      ]]
    });
    const usernames = documents.map(d => d.data.normalizedLabel);
    if (prevUsernames == null) {
      console.log(`${usernames.length} names already registered.`);
    } else {
      const newNames = usernames.filter(u => !prevUsernames.includes(u));
      if (newNames.length > 0) {
        createNotification(newNames);
      }
    }
    prevUsernames = usernames;
    await new Promise(r => setTimeout(r, 30 * 1000));
  }
})();

function createNotification(newNames) {
  const message = (newNames.length > 1 ?
    'New users:\n* ' + newNames.join('\n* ') :
    'New user: ' + newNames[0]
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
