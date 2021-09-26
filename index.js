import React from 'react';
import AppViews from './views/AppViews';
import CreatorViews from './views/CreatorViews';
import BuyerViews from './views/BuyerViews';
import PawnBrokerViews from './views/PawnBrokerViews';
import {renderDOM, renderView} from './views/render';
import './index.css';
import * as backend from './build/index.main.mjs';
import {loadStdlib} from '@reach-sh/stdlib';

const standardUnit = 'CFX';
const defaults = {defaultFundAmt: '10', defaultWager: '3', standardUnit};

const reach = loadStdlib({
  REACH_CONNECTOR_MODE: 'CFX',
  REACH_BUG: 'yes',
});
reach.setProviderByName('TestNet');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'ConnectAccount', ...defaults};
  }
  async componentDidMount() {
    const now = await reach.getNetworkTime();
    reach.setQueryLowerBound(reach.sub(now, 2000));
    const acc = await reach.getDefaultAccount();
    const balAtomic = await reach.balanceOf(acc);
    const bal = reach.formatCurrency(balAtomic, 4);
    this.setState({acc, bal});
    try {
      const faucet = await reach.getFaucet();
      this.setState({view: 'FundAccount', faucet});
    } catch (e) {
      this.setState({view: 'DeployerOrAttacher'});
    }
  }
  async fundAccount(fundAmount) {
    await reach.transfer(this.state.faucet, this.state.acc, reach.parseCurrency(fundAmount));
    this.setState({view: 'DeployerOrAttacher'});
  }
  async skipFundAccount() { this.setState({view: 'DeployerOrAttacher'}); }
  selectBuyer() { this.setState({view: 'Wrapper', ContentView: Buyer}); }
  selectPawnBroker() { this.setState({view: 'Wrapper', ContentView: PawnBroker}); }
  selectCreator() { this.setState({view: 'Wrapper', ContentView: Creator}); }
  render() { return renderView(this, AppViews); }
}

class Creator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'SetInfo'};
  }
  setInfo(id, price, tax) { this.setState({view: 'Deploy', id, price, tax}); }
  getId() {return this.state.id;}
  getPrice() {return this.state.price;}
  getTax() {return this.state.tax;}

  async deploy() {
    const ctc = this.props.acc.deploy(backend);
    this.setState({view: 'Deploying', ctc});
    this.id = reach.parseCurrency(this.state.id); // UInt
    this.price = reach.parseCurrency(this.state.price); // UInt
    this.tax = reach.parseCurrency(this.state.tax); // UInt
    backend.Creator(ctc, this);
    const ctcInfoStr = JSON.stringify(await ctc.getInfo(), null, 2);
    this.setState({view: 'WaitingForAttacher', ctcInfoStr});
  }
  render() { return renderView(this, CreatorViews); }
}

class Buyer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'Attach'};
  }

  attach(ctcInfoStr) {
    const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
    this.setState({view: 'Attaching'});
    backend.Buyer(ctc, this);
  }

  async buy(idAtomic, priceAtomic) {
    console.log(idAtomic, priceAtomic);
    const id = idAtomic.toNumber();
    const price = priceAtomic.toNumber();
    console.log(id, price);
    await new Promise(resolveHandP => {
      this.setState({view: 'BuyNFT', id, price, standardUnit, resolveHandP});
    });
  }

  async pawnIt(pawnPrice, redeemPrice, endDate) {
    console.log('pawn it in');
    this.pawnPrice = pawnPrice;
    this.redeemPrice = redeemPrice;
    this.endDate = endDate;
    this.setState({view: 'WaitingForPawn'});
    console.log('pawn it out');
  }

  async redeem(id, redeemPrice, endDate) {
    console.log("redeem in");
    await new Promise(resolveHandP => {
      this.setState({view: 'Redeem', id, resolveHandP});
    });
  }

  redeemIt(id) {
    this.setState({view: 'Redeem Success', id});
  }

  getPawnPrice()   {return this.pawnPrice};
  getRedeemPrice() {return this.redeemPrice};
  getEndDate()     {return this.endDate};

  buyIt() {
    this.setState({view: 'Pawn', standardUnit});
  }
  render() { return renderView(this, BuyerViews); }
}

class PawnBroker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {view: 'Attach'};
  }
  attach(ctcInfoStr) {
    const ctc = this.props.acc.attach(backend, JSON.parse(ctcInfoStr));
    this.setState({view: 'Attaching'});
    backend.PawnBroker(ctc, this);
  }

  accept(id, pawnPrice, redeemPrice, endDate) { // Fun([UInt], Null)
    console.log("start accept");
    this.setState({view: 'acceptPawn', id, pawnPrice, redeemPrice, endDate});
  }

  finish() {}
  
  render() { return renderView(this, PawnBrokerViews); }
}

renderDOM(<App />);
