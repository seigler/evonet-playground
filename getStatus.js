const DashJS = require('dash');
require('dotenv-safe').config();

const sdkOpts = {
  network: 'testnet',
  mnemonic: process.env.MNEMONIC,
};
const sdk = new DashJS.SDK(sdkOpts);

async function connect() {
  await sdk.isReady();
  console.log('ready');
  const balance = sdk.account.getConfirmedBalance();
  const unusedAddress = sdk.account.getUnusedAddress();
  console.log({
    balance,
    unusedAddress,
  });
  sdk.disconnect();
}
connect();
