'reach 0.1';
'use strict';

// Create NFT, set ID, price, and tax
const Creator = {getId: Fun([], UInt), getPrice: Fun([], UInt), getTax: Fun([], UInt)};

// Buy NFT, total cost
const Buyer = {
  buy: Fun([UInt, UInt], Null),
  pawn: Fun([UInt, UInt, UInt], Null),
  redeem: Fun([UInt, UInt, UInt, UInt], Null),
  endDate: UInt,
  redeemCost: UInt,
  pawnEarn: UInt,
  duration: UInt,
  buyCost: UInt
};

// Accept pawn, the day of accept, the total fee to pay
const PawnBroker = {acceptPawn: Fun([UInt, UInt, UInt], Null),
  startDate: UInt,
  acceptPawnCost: UInt
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
      const buyCost = declassify(interact.buyCost);
    });
    B.publish(buyCost);
    commit();
    B.pay(buyCost);
    // const res = buyCost - tax;
    transfer(buyCost).to(A);
    // transfer(tax).to(A);
    vNFT.owner.set(B);
    commit();

    // B pawn the nft
    B.only(() => {
      const pawnEarn = declassify(interact.pawnEarn);
      const duration = declassify(interact.duration);
      interact.pawn(id, pawnEarn, duration);
    });
    B.publish(pawnEarn, duration);
    commit();

    // C accept pawn, pay to A and B
    C.only(()=> {
      const startDate = declassify(interact.startDate);
      const acceptPawnCost = declassify(interact.acceptPawnCost);
      interact.acceptPawn(id, pawnEarn, duration);
    });
    C.publish(startDate, acceptPawnCost);
    commit();
    C.pay(acceptPawnCost);
    transfer(acceptPawnCost).to(B);
    vNFT.owner.set(C);
    commit();

    // B try to redeem NFT
    B.only(() => {
      const endDate = declassify(interact.endDate);
      const redeemCost = declassify(interact.redeemCost);
      interact.redeem(id, pawnEarn, endDate, duration);
    });
    B.publish(endDate, redeemCost);
    commit();
    B.pay(redeemCost);
    if (endDate >= duration + startDate || redeemCost < pawnEarn) {
      transfer(redeemCost).to(B);
    } else {
      const res2 = redeemCost - tax;
      transfer(tax).to(A);
      transfer(res2).to(C);
      vNFT.owner.set(B);
    }
    commit();
    exit();
  });
