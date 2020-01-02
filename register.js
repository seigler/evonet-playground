const DashJS = require('dash');

const sdkOpts = {
  network: 'testnet',
  mnemonic: 'a Dash wallet mnemonic with evonet funds goes here',
};
const sdk = new DashJS.SDK(sdkOpts);

const registerName = async function () {
  await sdk.isReady();
  const platform = sdk.platform;
  const identity = await platform.identities.get('an identity ID goes here');
  const nameRegistration = await platform.names.register('a name goes here', identity);
  console.log({nameRegistration});
};
registerName();
