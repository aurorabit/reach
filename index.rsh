'reach 0.1';
'use strict';

// Create NFT, set ID, price, and tax
const Creator = {getId: Fun([], UInt), getPrice: Fun([], UInt), getTax: Fun([], UInt)};

// Buy NFT, total cost
const Buyer = {
  buy: Fun([UInt, UInt], Null),
  pawnIt: Fun([], Null),
  redeem: Fun([UInt, UInt, UInt], Null),
  getPawnPrice: Fun([], UInt),
  getRedeemPrice: Fun([], UInt),
  getDuration: Fun([], UInt),
  getRedeemCost: Fun([], UInt),
  getCurrentDate: Fun([], UInt),
  getEndDate: Fun([], UInt)
};

// Accept pawn, the day of accept, the total fee to pay
const PawnBroker = {
  accept: Fun([UInt, UInt, UInt, UInt], Null)
};

const NFT = {owner: Address, id: UInt, price: UInt, tax: UInt};

export const main =
  Reach.App(
    {},
    [Participant('Creator', Creator),
      Participant('Buyer', Buyer),
      Participant('PawnBroker', PawnBroker),
      View('vNFT', NFT)],
    (A, B, C, vNFT) => {

    // create new nft, own by A
    A.only(() => {
      const id = declassify(interact.getId());
      const price = declassify(interact.getPrice());
      const tax = declassify(interact.getTax());
    });
    A.publish(id, price, tax);
    vNFT.owner.set(A);
    vNFT.id.set(id);
    vNFT.price.set(price);
    vNFT.tax.set(tax);
    commit();

    // B buy the nft
    B.only(() => {
      interact.buy(id, price);
    });
    B.pay(price);
    transfer(price).to(A);
    vNFT.owner.set(B);
    commit();

    // B pawn the nft
    B.only(() => {
      const pawnPrice = declassify(interact.getPawnPrice());
      const redeemPrice = declassify(interact.getRedeemPrice());
      const endDate = declassify(interact.getEndDate());
      interact.pawnIt();
    });
    B.publish(pawnPrice, redeemPrice, endDate);
    commit();

    // C accept pawn, pay to A and B
    C.only(()=> {
      interact.accept(id, pawnPrice, redeemPrice, endDate);
    });

    C.pay(pawnPrice);
    transfer(pawnPrice).to(B);
    commit();

    // B try to redeem NFT
    B.only(() => {
      const currentDate = declassify(interact.getCurrentDate());
      interact.redeem(id, redeemPrice, endDate);
    });
    B.publish(currentDate);
    commit();

    B.pay(redeemPrice);
    if (endDate >= currentDate) {
      const res2 = redeemPrice - tax;
      transfer(tax).to(A);
      transfer(res2).to(C);
      vNFT.owner.set(B);
    } else {
      transfer(redeemPrice).to(B);
    }
    
    commit();
    exit();
  });
