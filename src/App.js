import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import CurrencyService from './CurrencyService';
import AppCurrencyHeader from './AppCurrencyHeader';
import AppCurrencyList from './AppCurrencyList';
import './App.css';
import 'bulma/css/bulma.css';

library.add(faTimes);

const SYMBOL_TABLE = {
  'JPY': 'Japanese Yen',
  'HUF': 'Hungarian Forint',
  'CAD': 'Canadian Dollar',
  'IDR': 'Indonesian Rupiah',
  'GBP': 'British Pound',
  'SGD': 'Singapore Dollar',
  'CHF': 'Swiss Franc',
  'INR': 'Indian Rupee',
  'MYR': 'Malaysian Ringgit',
  'KRW': 'South Korean Won',
  'EUR': 'Euro',
  'USD': 'United States Dollar'
};

class App extends Component {
  constructor() {
    super();

    // State initialization
    this.state = {
      currencies: [],
      referenceCurrency: {
        shorthand: 'USD',
        name: 'US Dollar'
      },
      valuation: 0,
      displayedCurrencies: []
    };

    // Method bindings
    this.removeCurrencyHandler = this.removeCurrencyHandler.bind(this);
    this.changeValuationHandler = this.changeValuationHandler.bind(this);
    this.changeBaseCurrencyHandler = this.changeBaseCurrencyHandler.bind(this);
    this.selectMoreCurrencyHandler = this.selectMoreCurrencyHandler.bind(this);
  }

  componentDidMount() {
    // Initialize currencies state
    const baseCurrency = 'USD';
    this.getCurrencyRates(baseCurrency)
      .then(currencies => {
        this.setState({
          currencies: currencies,
          displayedCurrencies: currencies.slice(0, 4)
        });
      })
  }

  getCurrencyRates(base) {
    return CurrencyService.getRates(base)
      .then(result => {
        const rates = result.rates

        return Object.keys(rates).map(currency => {
          const rate = rates[currency];
          const currencyName = SYMBOL_TABLE[currency];
          return {
            shorthand: currency,
            name: currencyName,
            rate: rate
          }
        }).filter(currency => currency.name)
      });
  }

  removeCurrencyHandler(currencyName) {
    this.setState({
      displayedCurrencies: this.state.displayedCurrencies.filter((currency) => currency.name !== currencyName)
    });
  }

  changeValuationHandler(value) {
    this.setState({
      valuation: value
    });
  }

  changeBaseCurrencyHandler(currency) {
    const name = SYMBOL_TABLE[currency];
    this.getCurrencyRates(currency)
      .then(currencies => {
        this.setState({
          currencies: currencies,
          displayedCurrencies: currencies.slice(0, 4),
          referenceCurrency: {
            shorthand: currency,
            name: name
          }
        });
      });
  }

  selectMoreCurrencyHandler(newCurrency) {
    // Take currency from list of currencies
    let tobeAddedCurrency = this.state.currencies.filter(currency => currency.shorthand === newCurrency );
    this.setState({
      displayedCurrencies: this.state.displayedCurrencies.concat(tobeAddedCurrency)
    });
  }

  render() {
    const currencyName = SYMBOL_TABLE[this.state.referenceCurrency.shorthand];

    return (
      <div className="App container">
        <div className="App-currency card">
          <div className="App-currency-content card-content">

            <div className="columns">
              <div className="column">
                <h1 className="title is-4">{currencyName}</h1>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <AppCurrencyHeader
                  value={this.state.referenceCurrency.shorthand}
                  availableCurrencies={SYMBOL_TABLE}
                  changeBaseCurrency={this.changeBaseCurrencyHandler}
                  changeValuation={this.changeValuationHandler} />
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <AppCurrencyList
                  selectMoreCurrencyHandler={this.selectMoreCurrencyHandler}
                  availableCurrencies={SYMBOL_TABLE}
                  currencies={this.state.displayedCurrencies}
                  valuation={this.state.valuation}
                  referenceCurrency={this.state.referenceCurrency}
                  removeCurrency={this.removeCurrencyHandler} />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
