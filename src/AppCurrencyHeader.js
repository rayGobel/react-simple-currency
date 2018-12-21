import React, { Component } from 'react';

class AppCurrencyHeader extends Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.baseChangeHandler = this.baseChangeHandler.bind(this);
  }

  changeHandler(e) {
    const val = e.target.value;
    this.props.changeValuation(val);
  }

  baseChangeHandler(e) {
    const val = e.target.value;
    this.props.changeBaseCurrency(val);
  }

  render() {
    const currencyOptions = Object.keys(this.props.availableCurrencies)
      .sort()
      .map(currency => <option key={currency} value={currency}>{currency}</option>);

    return (
      <div className="columns">
        <div className="column is-7">
          <div className="select is-medium">
            <select value={this.props.value} onChange={this.baseChangeHandler}>
              {currencyOptions}
            </select>
          </div>
        </div>
        <div className="column is-5">
          <input className="input" onChange={this.changeHandler}></input>
        </div>
      </div>
    )
  }
}

export default AppCurrencyHeader;
