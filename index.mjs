import * as loader from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loader.loadStdlib();
  const startingBalance = stdlib.parseCurrency(1000);

  const accAlice = await stdlib.newTestAccount(startingBalance);
  const accBob = await stdlib.newTestAccount(startingBalance);
  const accClaire = await stdlib.newTestAccount(startingBalance);

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (who) => fmt(await stdlib.balanceOf(who));

  const ctcAlice = accAlice.deploy(backend);
  const ctcBob = accBob.attach(backend, ctcAlice.getInfo());
  const ctcClaire = accClaire.attach(backend, ctcAlice.getInfo());

  const price = 100;
  const tax = 1;
  const pawnEarn = 10;
  const startDate = 1;
  const endDate = 5;
  const duration = 7;

  await Promise.all([
    backend.Creator(
      ctcAlice,
      { getId: () => {
          const id = stdlib.randomUInt();
          console.log(`Alice creates NFT ${id} (price : ${price}, tax: ${tax})`);
          return id;
        }, getPrice: () => {
          return price;
        }, getTax: () => {
          return tax;
        }
      }
    ),

    backend.Buyer(
      ctcBob,
      {
        buy: (id, price) => {
        console.log(`Bob costs ${stdlib.add(price, tax)} for purchasing ${id}, price: ${price} + tax: ${tax}`);
        },
        pawn: (id, pawnEarn, duration) => {
          console.log(`Bob want to pawn with ${pawnEarn}. (at most ${duration} days)`)
        },
        redeem: (id, pawnEarn, endDate, duration) => {
          console.log(`Bob redeem ${id} at day ${endDate}, need to pay ${stdlib.add(pawnEarn, tax)} at least, price: ${pawnEarn}`)
        },
        buyCost: stdlib.parseCurrency(price),
        endDate: endDate,
        redeemCost: stdlib.parseCurrency(stdlib.add(pawnEarn, tax)),
        pawnEarn: pawnEarn,
        duration: duration,
      },
    ),

    backend.PawnBroker(
      ctcClaire,
      { acceptPawn: (id, pawnEarn, duration) => {
        console.log(`Claire accepted pawn at day ${startDate}, need to pay ${pawnEarn} at least.`);
        },
        startDate: startDate,
        acceptPawnCost: stdlib.parseCurrency(pawnEarn)
      }
    ),
  ]);

  console.log(`Alice has ${await getBalance(accAlice)}.`);
  console.log(`Bob has ${await getBalance(accBob)}.`);
  console.log(`Claire has ${await getBalance(accClaire)}.`);

})();
