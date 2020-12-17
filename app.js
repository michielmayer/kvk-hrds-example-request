import DataServiceClient from './DataServiceClient';

(async () => {
  let args = {
    kvkNummer: '90004426', // '90000021'
    klantreferentie: 'InnovatieLab',
  };

  let result = await DataServiceClient('ophalenInschrijving', args);
  console.log(result);
})();