const dash = require('dash');

const sdkOpts = {
  network: 'testnet'
};

if (process.argv.length !== 3) {
  throw new Error('Expected 1 argument: name');
}
const name = process.argv[2];

const getDocuments = async function () {
  const client = new dash.Client(sdkOpts);
  await client.isReady();
  const platform = client.platform;
  const originalProfile = await platform.names.get(name);
  if (originalProfile == null) {
    console.log(`User "${name}" not found.`);
    return;
  }
  const id = originalProfile.userId;

  let documents;
  let profiles = [];
  let startAt = 0;
  do {
    documents = await platform.documents.get('dpns.domain', {
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
        ['records.dashIdentity', '==', id]
      ],
      startAt: startAt
    });
    profiles = profiles.concat(
      documents.map(d => ({
        name: d.data.normalizedLabel
      }))
    );
    startAt += 100;
  } while (documents.length === 100);
  client.disconnect();
  profiles.forEach(u => console.log(u.name));
};
getDocuments();
