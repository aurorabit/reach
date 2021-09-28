import React from 'react';
import PlayerViews from './PlayerViews';

const exports = {...PlayerViews};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Attacher (Clarie)</h2>
        {content}
      </div>
    );
  }
}

exports.Attach = class extends React.Component {
  render() {
    const {parent} = this.props;
    const {ctcInfoStr} = this.state || {};
    return (
      <div>
        Please paste the contract info to attach to:
        <br />
        <textarea spellCheck="false"
          className='ContractInfo'
          onChange={(e) => this.setState({ctcInfoStr: e.currentTarget.value})}
          placeholder='{}'
        />
        <br />
        <button
          disabled={!ctcInfoStr}
          onClick={() => parent.attach(ctcInfoStr)}
        >Attach</button>
      </div>
    );
  }
}

exports.Attaching = class extends React.Component {
  render() {
    return (
      <div>
        Attaching, please wait...
      </div>
    );
  }
}

exports.BuyNFT = class extends React.Component {
  render() {
    const {id, price, tax, standardUnit, parent} = this.props;
    const {disabled} = this.state || {};
    return (
      <div>
        The info of NFT:
        <br /> Id: #{id} {standardUnit}
        <br /> Price: {price} {standardUnit}
        <br /> Tax: {tax} {standardUnit}
        <br />
        <button
          disabled={disabled}
          onClick={() => {
            this.setState({disabled: true});
            parent.buyIt();
          }}
        >Buy It</button>
      </div>
    );
  }
}

exports.acceptPawn = class extends React.Component {
  render() {
    const {parent, id, pawnPrice, redeemPrice, endDate, standardUnit} = this.props;
    return (
      <div>
        The info of Pawn:
        <br /> Id: #{id} {standardUnit}
        <br /> pawnPrice: {pawnPrice} {standardUnit}
        <br /> redeemPrice: {redeemPrice} {standardUnit}
        <br /> endDate: {endDate} {standardUnit}
        <br />
        <button
          onClick={() => parent.finish()}
        >Pawn</button>
      </div>
    );
  }
}
export default exports;
