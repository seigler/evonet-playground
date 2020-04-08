const dash = require('dash');

const sdkOpts = {
  network: 'testnet'
};

if (process.argv.length !== 3) {
  throw new Error('Expected 1 argument: id');
}
const id = process.argv[2];

const client = new dash.Client(sdkOpts);

(async function () {
  await client.isReady();
  const identity = await client.platform.identities.get(id);
  console.log(identity);
  client.disconnect();
})();
