import React from 'react';
import PlayerViews from './PlayerViews';

const exports = {...PlayerViews};

exports.Wrapper = class extends React.Component {
  render() {
    const {content} = this.props;
    return (
      <div className="Attacher">
        <h2>Attacher (Bob)</h2>
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
    const {id, price, standardUnit, parent} = this.props;
    const {disabled} = this.state || {};
    console.log(id, price);
    return (
      <div>
        The info of NFT:
        <br /> Id: #{`${id}`}
        <br /> Price: {`${price}`} {standardUnit}
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

exports.Pawn = class extends React.Component {
  render() {
    const {parent, standardUnit} = this.props;
    const pawnPrice = (this.state || {}).pawnPrice;
    const redeemPrice = (this.state || {}).redeemPrice;
    const endDate = (this.state || {}).endDate;
    return (
      <div>
        pawnPrice: <input
          type='number'
          onChange={(e) => this.setState({pawnPrice: e.currentTarget.value})}
        /> {standardUnit}
        <br />
        redeemPrice: <input
          type='number'
          onChange={(e) => this.setState({redeemPrice: e.currentTarget.value})}
        /> {standardUnit}
        <br />
        endDate: <input
          type='number'
          onChange={(e) => this.setState({endDate: e.currentTarget.value})}
        />
        <br />
        <br />
        <button
          onClick={() => parent.pawnIt(pawnPrice, redeemPrice, endDate)}
        >Pawn</button>
      </div>
    );
  }
}

exports.Redeem = class extends React.Component {
  render() {
    const {parent, standardUnit} = this.props;
    const id = (this.state || {}).id;
    const redeemPrice = (this.state || {}).redeemPrice;
    const endDate = (this.state || {}).endDate;
    return (
      <div>
        The info of NFT:
        <br /> Id: #{id} {standardUnit}
        <br /> RedeemPrice: {redeemPrice} {standardUnit}
        <br /> endDate: {endDate} {standardUnit}
        <br />
        <button
          onClick={() => parent.redeemIt(id)}
        >Redeem</button>
      </div>
    )
  }
}

exports.WaitingForPawn = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for Pawn...
      </div>
    );
  }
}

export default exports;