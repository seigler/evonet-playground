const dash = require('dash');

const sdkOpts = {
  network: 'testnet'
};

if (process.argv.length != 3) {
  throw new Error('Expected 1 argument: id');
}
const id = process.argv[2];

const sdk = new dash.SDK(sdkOpts);

(async function () {
  await sdk.isReady();
  const identity = await sdk.platform.identities.get(id);
  console.log(identity);
  sdk.disconnect();
})();
