// Creates a payment URI using the private key used for all identities under
// this mnemonic. Soon this will need updating to use an identity-specific
// private key.

require('dotenv-safe').config();
const dash = require('dash');
const { PrivateKey, Message } = require('@dashevo/dashcore-lib');

if (process.argv.length != 3) {
  throw new Error('Expected 1 argument: name');
}
const name = process.argv[2];

const sdkOpts = {
  mnemonic: process.env.MNEMONIC,
  network: 'testnet',
};

(async function () {
  const sdk = new dash.SDK(sdkOpts);
  await sdk.isReady();

  const address = sdk.account.getUnusedAddress().address;

  //TODO: this will eventually stop working
  const idHDKey = sdk.account.getIdentityHDKey(0, 'user');
  const privKey = PrivateKey.fromObject(idHDKey.privateKey);
  const signature = Message(address).sign(privKey);

  console.log(`dash:${address}?dpn=${name},${signature}`)

  sdk.disconnect();
})();
