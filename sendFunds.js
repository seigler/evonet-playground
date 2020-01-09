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
  const transaction = sdk.account.createTransaction({
    recipient: 'yNPbcFfabtNmmxKdGwhHomdYfVs6gikbPf', // Evonet faucet
    satoshis: 100000000 // 1 Dash
  });
  const result = await sdk.account.broadcastTransaction(transaction);
  console.log('Transaction broadcast\nConfirmation:', result);
  sdk.disconnect();
}
connect();
