import uuidv4 from 'uuid/v4';
import soap from 'soap';
import fs from 'fs';

export default async function DataServiceClient(action, args) {
  let url = 'http://schemas.kvk.nl/contracts/kvk/dataservice/catalogus/2015/02/KVK-KvKDataservice.wsdl';

  let client;
  try {
    client = await soap.createClientAsync(url);
  } catch (error) {
    console.log(error);
  }

  let uu = uuidv4();

  client.setEndpoint('https://webservices.preprod.kvk.nl/postbus2');
  client.addSoapHeader(`<wsa:Action Id="_2">http://es.kvk.nl/${action}</wsa:Action>`);
  client.addSoapHeader(`<wsa:MessageID Id="_3">uuid:${uu}</wsa:MessageID>`);
  client.addSoapHeader(`<wsa:To Id="_4">http://es.kvk.nl/KVK-DataservicePP/2015/02</wsa:To>`);

  let privateKey = fs.readFileSync('./keys/privateKey.pem');
  let publicKey = fs.readFileSync('./keys/innovatielab-2018.kvk.nl.cer');
  let wsSecurity = new soap.WSSecurityCert(privateKey, publicKey);

  client.setSecurity(wsSecurity);

  client.setSSLSecurity(
    new soap.ClientSSLSecurity(
      './keys/privateKey.pem',
      './keys/innovatielab-2018.kvk.nl.cer'
    )
  );

  let result
  try {
    result = await client[`${action}Async`](args);
  } catch (error) {
    console.log(error);
  }
  return result
}
