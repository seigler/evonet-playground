const DashJS = require('dash');
require('dotenv-safe').config();

const sdkOpts = {
  network: 'testnet',
  mnemonic: process.env.MNEMONIC
};
const client = new DashJS.Client(sdkOpts);

async function connect () {
  await client.isReady();
  console.log('ready');
  const unconfirmedBalance = client.account.getUnconfirmedBalance();
  const confirmedBalance = client.account.getConfirmedBalance();
  const unusedAddress = client.account.getUnusedAddress();
  console.log({
    unconfirmedBalance,
    confirmedBalance,
    unusedAddress
  });
  client.disconnect();
}
connect();
