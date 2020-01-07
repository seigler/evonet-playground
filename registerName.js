const DashJS = require('dash');
require('dotenv-safe').config();

if (process.argv.length != 3) {
  throw new Error('Expected 1 argument: name');
}
const name = process.argv[2];

const registerName = async function () {
  const sdkOpts = {
    network: 'testnet',
    mnemonic: process.env.MNEMONIC,
  };
  const sdk = new DashJS.SDK(sdkOpts);
  await sdk.isReady();
  const platform = sdk.platform;
  const identity = await platform.identities.get(process.env.ID);
  const nameRegistration = await platform.names.register(name, identity);
  console.log({nameRegistration});
};
registerName();
