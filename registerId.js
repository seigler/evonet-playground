const DashJS = require('dash');
require('dotenv').config();

const sdkOpts = {
  network: 'testnet',
  mnemonic: process.env.MNEMONIC,
};
const sdk = new DashJS.SDK(sdkOpts);

const createIdentity = async function () {
  await sdk.isReady();
  const platform = sdk.platform;
  platform.identities.register('user')  // literal string 'user'
    .then((identity) => {
      console.log({identity});
    });
};
createIdentity();
