const dash = require('dash');

const sdkOpts = {
  network: 'testnet'
};
const sdk = new dash.SDK(sdkOpts);

if (process.argv.length != 3) {
  throw new Error('Expected 1 argument: name');
}
const name = process.argv[2];

(async function () {
  let platform = sdk.platform;
  await sdk.isReady();

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
        await new Promise(r => setTimeout(r, 2000));
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
  } while (documents.length == 100);

  const uniqueIds = usernames.map(u => u.id).filter(
    (val, i, arr) => (arr.indexOf(val) === i)
  );
  const identities = await Promise.all(uniqueIds.map(
    id => platform.identities.get(id)
  ));
  usernames = usernames.map(u => ({
    ...u,
    keyData: identities.find(i => i.id === u.id).publicKeys[0].data
  }))
  const nameOfInterest = usernames.find(u => u.label === name);
  const matches = usernames.filter(u => u.keyData === nameOfInterest.keyData);
  console.log(`Matches for public key used in name ${name}.dash`);
  matches.forEach(m => {
    console.log(`${m.label}.${m.domain} - ${m.id}`);
  });
})();
