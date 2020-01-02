const DashJS = require('dash');
const bs58 = require('bs58');
const entropy = require('@dashevo/dpp/lib/util/entropy');
const { hash } = require('@dashevo/dpp/lib/util/multihashDoubleSHA256');
const Identity = require('@dashevo/dpp/lib/identity/Identity');

const sdkOpts = {
  network: 'testnet',
  mnemonic: 'your mnemonic here',
};
const id = 'your id here';
const name = 'yournamehere.dash';

register();

async function register () {
  const sdk = new DashJS.SDK(sdkOpts);
  await sdk.isReady();
  console.log('Retrieving identity');
  const idBuffer = await sdk.clients.dapi.getIdentity(id);
  const identity = sdk.platform.dpp.identity.createFromSerialized(idBuffer);

  console.log('Getting identity private key');

  const hardenedFeatureRootKey = sdk.platform.account.keyChain.getHardenedDIP9FeaturePath();    // Feature 5 : identity.
  const identityFeatureKey = hardenedFeatureRootKey.deriveChild(5, true);    //TODO : Here, we always use index 0. We might want to increment.
  const identityHDPrivateKey = identityFeatureKey
    .deriveChild(sdk.platform.account.index, true)
    .deriveChild(Identity.TYPES['USER'], false)
    .deriveChild(0, false);
  const identityPrivateKey = identityHDPrivateKey.privateKey;
  const identityPublicKey = identityHDPrivateKey.publicKey;

  const records = { dashIdentity: id };

  const serializedContract = await sdk.clients.dapi.getDataContract(
    '2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse'
  );
  const dataContract = sdk.platform.dpp.dataContract.createFromSerialized(
    serializedContract
  );

  registerMethod(
    sdk.clients.dapi,
    sdk.platform.dpp,
    name,
    identity,
    identityPrivateKey,
    records,
    dataContract
  );
}

async function registerMethod(dapiClient, dpp, name, user, privateKey, records, dataContract) {

  const nameLabels = name.split('.');

  const normalizedParentDomainName = nameLabels
    .slice(1)
    .join('.')
    .toLowerCase();

  const [label] = nameLabels;
  const normalizedLabel = label.toLowerCase();

  const preorderSalt = entropy.generate();
  console.log(preorderSalt);

  const fullDomainName = normalizedParentDomainName.length > 0
    ? `${normalizedLabel}.${normalizedParentDomainName}`
    : normalizedLabel;

  console.log(fullDomainName)

  const nameHash = hash(
    Buffer.from(fullDomainName),
  ).toString('hex');

  const saltedDomainHashBuffer = Buffer.concat([
    bs58.decode(preorderSalt),
    Buffer.from(nameHash, 'hex'),
  ]);

  const saltedDomainHash = hash(
    saltedDomainHashBuffer,
  ).toString('hex');

  console.log(saltedDomainHash)

  // 1. Create preorder document
  const preorderDocument = dpp.document.create(
    dataContract,
    user.getId(),
    'preorder',
    {
      saltedDomainHash,
    },
  );

  console.log('pre-doc')
  console.dir(preorderDocument)

  // 2. Create and send preorder state tranisition
  const preorderTransition = dpp.document.createStateTransition([preorderDocument]);
  preorderTransition.sign(user.getPublicKeyById(1), privateKey);

  console.log('pre-st')
  console.dir(preorderTransition)
  await dapiClient.applyStateTransition(preorderTransition);

  // 3. Create domain document
  const domainDocument = dpp.document.create(
    dataContract,
    user.getId(),
    'domain',
    {
      nameHash,
      label,
      normalizedLabel,
      normalizedParentDomainName,
      preorderSalt,
      records,
    },
  );

  console.dir(domainDocument)

  // 4. Create and send domain state transition
  const domainTransition = dpp.document.createStateTransition([domainDocument]);
  domainTransition.sign(user.getPublicKeyById(1), privateKey);

  console.dir(domainTransition, {depth:10})

  await dapiClient.applyStateTransition(domainTransition);

  return domainDocument;
}
