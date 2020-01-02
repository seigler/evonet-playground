const DAPIClient = require('@dashevo/dapi-client');
const DashPlatformProtocol = require('@dashevo/dpp');

const start = async () => {

  var dapiClient = new DAPIClient({
    seeds: [{
      service: 'evonet.thephez.com:3000',
      port: 3000
    }],
  });

  const dpp = new DashPlatformProtocol();

  // DPNS ID
  contractId = '2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse';

  const rawDataList = await dapiClient.getDocuments(contractId, 'domain', { });

  let documents = [];
  for (const rawData of rawDataList) {
    doc = await dpp.document.createFromSerialized(rawData, {skipValidation: true})

    console.log('Name: ' + doc.data.label + ' (domain: ' + doc.data.normalizedParentDomainName + ') User Identity: ' + doc.userId)
  }
};

start();
