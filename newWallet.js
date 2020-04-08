const DashJS = require('dash');

const sdkOpts = {
  network: 'testnet',
  mnemonic: null // this indicates that we want a wallet to be generated
};
const client = new DashJS.Client(sdkOpts);

async function connect () {
  await client.isReady();
  const mnemonic = client.wallet.exportWallet();
  const address = client.account.getUnusedAddress();
  client.disconnect();
  console.log('Mnemonic:', mnemonic);
  console.log('Unused address:', address.address);
}
connect();
