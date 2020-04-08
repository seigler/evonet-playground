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
  const transaction = client.account.createTransaction({
    recipient: 'yNPbcFfabtNmmxKdGwhHomdYfVs6gikbPf', // Evonet faucet
    satoshis: 100000000 // 1 Dash
  });
  const result = await client.account.broadcastTransaction(transaction);
  console.log('Transaction broadcast\nConfirmation:', result);
  client.disconnect();
}
connect();
