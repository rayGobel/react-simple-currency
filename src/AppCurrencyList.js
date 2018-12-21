import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class AppCurrencyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAvailableCurrencies: false
    };
    this.addMoreCurrencyHandler = this.addMoreCurrencyHandler.bind(this);
  }

  addMoreCurrencyHandler() {
    this.setState({
      showAvailableCurrencies: true
    });
  }

  render() {

    const notDisplayedCurrencies = Object.keys(this.props.availableCurrencies)
      .filter(currency => {
        return !this.props.currencies.some(otherCurrency => otherCurrency.name === currency)
      });
    console.log('data: ', notDisplayedCurrencies);

    const referenceCurrency = this.props.referenceCurrency;
    const renderedList = this.props.currencies.map((currency) => {

      const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency.shorthand,
        minimumFractionDigits: 2
      });

      return (
        <div className="columns" key={currency.shorthand}>

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

    const addCurrencyBtn = !this.state.showAvailableCurrencies ?
      <AddCurrencyBtn addMoreCurrencyHandler={this.addMoreCurrencyHandler} />
      : null;
    const currencyList = this.state.showAvailableCurrencies ?
      <CurrencyList availableCurrencies={notDisplayedCurrencies} />
      : null;

    return (
      <div className="App-currency-content card-content">
        {renderedList}

        <div className="columns">
          <div className="column">
            {addCurrencyBtn}
            {currencyList}
          </div>
        </div>
      </div>
    );
  }

}

class AddCurrencyBtn extends Component {
  render() {
    return (
      <button className="button" onClick={this.props.addMoreCurrencyHandler}>
        Add more currency
      </button>
    );
  }
}

class CurrencyList extends Component {
  render() {
    const options = this.props.availableCurrencies
      .map(currency => <option key={currency} value={currency}>{currency}</option>);

    return (
      <div className="select is-medium">
        <select>
          {options}
        </select>
      </div>
    );
  }
}

export default AppCurrencyList
