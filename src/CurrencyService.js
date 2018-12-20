import axios from 'axios';

const BASE_URL = 'https://api.exchangeratesapi.io/latest';

const CurrencyService = {
  getCurrencyRates(base) {
    let url = `${BASE_URL}`

    if (base) {
      url = `${BASE_URL}?base=${base}`
    }

    return axios.get(url)
      .then(result => {
        return result.data
      });
  }
};

export default CurrencyService
