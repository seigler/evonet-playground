const dash = require('dash');

const sdkOpts = {
  network: 'testnet'
};
const client = new dash.Client(sdkOpts);

if (process.argv.length !== 3) {
  throw new Error('Expected 1 argument: name');
}
const name = process.argv[2];

(async function () {
  const platform = client.platform;
  await client.isReady();

  let documents;
  let usernames = [];
  let startAt = 0;
  do {
    let retry = true;
    do {
      try {
        documents = await platform.documents.get('dpns.domain', { startAt });
        retry = false;
      } catch (e) {
        console.error(e.metadata);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (retry);
    usernames = usernames.concat(
      documents.map(d => ({
        label: d.data.normalizedLabel,
        domain: d.data.normalizedParentDomainName,
        id: d.userId
      }))
    );
    startAt += 100;
  } while (documents.length === 100);

  const uniqueIds = usernames.map(u => u.id).filter(
    (val, i, arr) => (arr.indexOf(val) === i)
  );
  const identities = await Promise.all(uniqueIds.map(
    id => platform.identities.get(id)
  ));
  usernames = usernames.map(u => ({
    ...u,
    keyData: identities.find(i => i.id === u.id).publicKeys[0].data
  }));
  const nameOfInterest = usernames.find(u => u.label === name);
  const matches = usernames.filter(u => u.keyData === nameOfInterest.keyData);
  console.log(`Matches for public key used in name ${name}.dash`);
  matches.forEach(m => {
    console.log(`${m.label}.${m.domain} - ${m.id}`);
  });
})();
