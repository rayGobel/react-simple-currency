import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class AppCurrencyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAvailableCurrencies: false
    };
    this.addMoreCurrencyHandler = this.addMoreCurrencyHandler.bind(this);
    this.selectMoreCurrencyHandler = this.selectMoreCurrencyHandler.bind(this);
  }

  addMoreCurrencyHandler() {
    this.setState({
      showAvailableCurrencies: true
    });
  }

  selectMoreCurrencyHandler(currencyName) {
    this.setState({
      showAvailableCurrencies: false
    });
    this.props.selectMoreCurrencyHandler(currencyName);
  }

  render() {

    const notDisplayedCurrencies = Object.keys(this.props.availableCurrencies)
      .filter(currency => {
        return !this.props.currencies.some(otherCurrency => otherCurrency.shorthand === currency)
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
      <CurrencyList
        selectMoreCurrencyHandler={this.selectMoreCurrencyHandler}
        availableCurrencies={notDisplayedCurrencies} />
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
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.clickHandler = this.clickHandler.bind(this);
    this.selectChangedHandler = this.selectChangedHandler.bind(this);
  }

  selectChangedHandler(e) {
    this.setState({
      value: e.target.value
    });
  }

  clickHandler() {
    if (this.state.value) {
      this.props.selectMoreCurrencyHandler(this.state.value);
    }
  }

  render() {
    const options = this.props.availableCurrencies
      .map(currency => <option key={currency} value={currency}>{currency}</option>);

    return (
      <div className="field has-addons">
        <div className="control is-expanded">
          <div className="select is-fullwidth">
            <select value={this.state.value} onChange={this.selectChangedHandler}>
              <option value=''>Select currency</option>
              {options}
            </select>
          </div>
        </div>

        <div className="control">
          <button type="submit" className="button" onClick={this.clickHandler}>Add currency</button>
        </div>
      </div>
    );
  }
}

export default AppCurrencyList
