const DashJS = require('dash');
require('dotenv-safe').config({
  allowEmptyValues: true
});

const sdkOpts = {
  seeds: [
    { service: 'seed-1.evonet.networks.dash.org' },
    { service: 'seed-2.evonet.networks.dash.org' },
    { service: 'seed-3.evonet.networks.dash.org' },
    { service: 'seed-4.evonet.networks.dash.org' },
    { service: 'seed-5.evonet.networks.dash.org' },
  ],
  apps: {
    dpns: {
      contractId: '7PBvxeGpj7SsWfvDSa31uqEMt58LAiJww7zNcVRP1uEM'
    }
  },
  mnemonic: process.env.MNEMONIC
};
const sdk = new DashJS.Client(sdkOpts);

const createIdentity = async function () {
  await sdk.isReady();
  const platform = sdk.platform;
  platform.identities.register('user') // literal string 'user'
    .then((identity) => {
      console.log({ identity });
    });
  sdk.disconnect();
};
createIdentity();
