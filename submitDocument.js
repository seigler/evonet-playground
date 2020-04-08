const DashJS = require('dash');
require('dotenv-safe').config();

const sdkOpts = {
  seeds: ['54.148.62.72'],
  network: 'testnet',
  mnemonic: process.env.MNEMONIC
};
const client = new DashJS.Client(sdkOpts);

const submitPreorderDocument = async function () {
  const platform = client.platform;
  await client.isReady();

  try {
    const identity = await platform.identities.get('an identity ID goes here');

    const docProperties = {
      saltedDomainHash: 'a previously calculated hash'
    };

    // Create the preorder document
    const preorderDocument = await platform.documents.create(
      'dpns.preorder',
      identity,
      docProperties
    );

    // Sign and submit the document
    await platform.documents.broadcast(preorderDocument, identity);
    
    // Retrieve the submitted document
    const retrievedPreorder = await platform.documents.get(
      'dpns.preorder',
      {
        where: [['saltedDomainHash', '==', docProperties.saltedDomainHash]]
      }
    );
    console.dir({ retrievedPreorder }, { depth: 10 });
  } catch (e) {
    console.error('Something went wrong:', e);
  } finally {
    client.disconnect();
  }
};

submitPreorderDocument();
