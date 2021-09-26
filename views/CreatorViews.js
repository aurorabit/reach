import React from 'react';
import PlayerViews from './PlayerViews';

const exports = {...PlayerViews};

const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Deployer">
        <h2>Deployer (Alice)</h2>
        {content}
      </div>
    );
  }
}

exports.SetInfo = class extends React.Component {
  render() {
    const {parent, defaultId, defaultPrice, defaultTax, standardUnit} = this.props;
    const id = (this.state || {}).id || defaultId;
    const price = (this.state || {}).price || defaultPrice;
    const tax = (this.state || {}).tax || defaultTax;
    return (
      <div>
        ID: <input
          type='number'
          placeholder={defaultId}
          onChange={(e) => this.setState({id: e.currentTarget.value})}
        /> <br/>
        Price: <input
          type='number'
          placeholder={defaultPrice}
          onChange={(e) => this.setState({price: e.currentTarget.value})}
        /> {standardUnit}<br/>
        Tax: <input
          type='number'
          placeholder={defaultTax}
          onChange={(e) => this.setState({tax: e.currentTarget.value})}
        /> {standardUnit}
        <br />
        <button
          onClick={() => parent.setInfo(id, price, tax)}
        >Set Info</button>
      </div>
    );
  }
}

exports.Deploy = class extends React.Component {
  render() {
    const {parent, id, price, tax, standardUnit} = this.props;
    return (
      <div>
        NFT id: <strong>{id}</strong> {standardUnit}
        <br />
        NFT price: <strong>{price}</strong> {standardUnit}
        <br />
        NFT tax: <strong>{tax}</strong> {standardUnit}
        <br />
        <button
          onClick={() => parent.deploy()}
        >Create</button>
      </div>
    );
  }
}

exports.Deploying = class extends React.Component {
  render() {
    return (
      <div>Deploying... please wait.</div>
    );
  }
}

exports.WaitingForAttacher = class extends React.Component {
  async copyToClipborad(button) {
    const {ctcInfoStr} = this.props;
    navigator.clipboard.writeText(ctcInfoStr);
    const origInnerHTML = button.innerHTML;
    button.innerHTML = 'Copied!';
    button.disabled = true;
    await sleep(1000);
    button.innerHTML = origInnerHTML;
    button.disabled = false;
  }

  render() {
    const {ctcInfoStr} = this.props;
    return (
      <div>
        Waiting for Attacher to join...
        <br /> Please give them this contract info:
        <pre className='ContractInfo'>
          {ctcInfoStr}
        </pre>
        <button
          onClick={(e) => this.copyToClipborad(e.currentTarget)}
        >Copy to clipboard</button>
      </div>
    )
  }
}

export default exports;
