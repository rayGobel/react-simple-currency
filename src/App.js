import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import CurrencyService from './CurrencyService';
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
      valuation: 0
    };

    // Method bindings
    this.removeCurrencyHandler = this.removeCurrencyHandler.bind(this);
    this.changeValuationHandler = this.changeValuationHandler.bind(this);
  }

  componentDidMount() {
    // Initialize currencies state
    this.getCurrencyRates('USD')
      .then(currencies => {
        this.setState({
          currencies: currencies
        });
      })
  }

  getCurrencyRates(base) {
    return CurrencyService.getCurrencyRates(base)
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
      currencies: this.state.currencies.filter((currency) => currency.name !== currencyName)
    });
  }

  changeValuationHandler(value) {
    this.setState({
      valuation: value
    });
  }

  render() {
    return (
      <div className="App container">
        <div className="App-currency card">
          <div className="App-currency-content card-content">

            <div className="columns">
              <div className="column">
                <h1 className="title is-4">United States Dollar</h1>
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <AppCurrencyHeader
                  changeValuation={this.changeValuationHandler} />
              </div>
            </div>

            <div className="columns">
              <div className="column">
                <AppCurrencyContent
                currencies={this.state.currencies}
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

class AppCurrencyHeader extends Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    const val = e.target.value;
    this.props.changeValuation(val);
  }

  render() {
    return (
      <div className="columns">
        <div className="column is-7">
          <p>USD</p>
        </div>
        <div className="column is-5">
          <input className="input" onChange={this.changeHandler}></input>
        </div>
      </div>
    )
  }
}

class AppCurrencyContent extends Component {

  render() {

    const referenceCurrency = this.props.referenceCurrency;
    const renderedList = this.props.currencies.map((currency) => {
      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency.shorthand,
        minimumFractionDigits: 2
      });

      return (
        <div key={currency.shorthand} className="columns">

          <div className="column is-10">
            <h1>{ currency.name }</h1>
            <p>{ formatter.format(currency.rate * this.props.valuation ) }</p>
            <p>{ currency.rate } { currency.shorthand } = 1 { referenceCurrency.shorthand }</p>
          </div>

          <div className="column is-2">
            <button className="button" onClick={(e) => this.props.removeCurrency(currency.name)}>
              <FontAwesomeIcon icon="times" />
            </button>
          </div>
        </div>
      );
    });

    return (
      <div className="App-currency-content card-content">
        {renderedList}
      </div>
    );
  }
}

export default App;
