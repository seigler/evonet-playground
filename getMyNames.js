const dash = require('dash');

const sdkOpts = {
  network: 'testnet'
};
const client = new dash.Client(sdkOpts);

const getDocuments = async function () {
  const platform = client.platform;
  await client.isReady();

  let documents;
  let profiles = [];
  let startAt = 0;
  do {
    documents = await platform.documents.get('dpns.domain', {
      where: [
        ['normalizedParentDomainName', '==', 'dash'],
      ],
      startAt: startAt
    });
    profiles = profiles.concat(
      documents.map(d => ({
        name: d.data.normalizedLabel,
        nameHash: d.data.nameHash,
        identity: d.userId
      }))
    );
    startAt += 100;
  } while (documents.length === 100);
  client.disconnect();
  profiles.forEach(u => console.dir(u));
};
getDocuments();
