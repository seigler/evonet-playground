const dash = require('dash');
const player = require('play-sound')(opts = {});
const notifier = require('node-notifier');

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
    if (prevUsernames != null) {
      const newNames = usernames.filter(u => !prevUsernames.includes(u));
      if (newNames.length > 0) {
        createNotification('New users: ' + newNames.toString());
      }
    }
    prevUsernames = usernames;
    await new Promise(r => setTimeout(r, 30 * 1000));
  }
})();

function createNotification(message) {
  player.play('notify.mp3', function(err){ if (err) throw err; });
  notifier.notify({
    title: 'EvoNet monitor',
    message
  });
}
