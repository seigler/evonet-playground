const DashJS = require('dash');

const sdkOpts = {
  network: 'testnet',
  mnemonic: null, // this indicates that we want a wallet to be generated
};
const sdk = new DashJS.SDK(sdkOpts);

async function connect() {
  await sdk.isReady();
  const mnemonic = sdk.wallet.exportWallet();
  const address = sdk.account.getUnusedAddress();
  sdk.disconnect();
  console.log('Mnemonic:', mnemonic);
  console.log('Unused address:', address.address);
}
connect();
