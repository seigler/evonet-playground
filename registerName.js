const DashJS = require('dash');
require('dotenv').load();

const sdkOpts = {
  network: 'testnet',
  mnemonic: provess.env.MNEMONIC,
};
const sdk = new DashJS.SDK(sdkOpts);

const registerName = async function () {
  await sdk.isReady();
  const platform = sdk.platform;
  const identity = await platform.identities.get(process.env.ID);
  const nameRegistration = await platform.names.register('j', identity);
  console.log({nameRegistration});
};
registerName();
