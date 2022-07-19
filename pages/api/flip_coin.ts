import Base58 from 'bs58'
import {
  Keypair,
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";

const string2Uint8Array = async (str: string) => {
  var decodedString;
  try {
    decodedString = Base58.decode(str);
  } catch (error) {
    return [];
  }
  let arr = [];

  for (var i = 0; i < decodedString.length; i++) {
    arr.push(decodedString[i]);
  };

  return arr;
}

const transferSOL = async (fromWallet: any, toPubKey: any, sol: any) => {
  // @ts-ignore
  const connection = new Connection(clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NETWORK), 'confirmed');

  try {
    // Add transfer instruction to transaction
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: new PublicKey(toPubKey),
        lamports: sol * LAMPORTS_PER_SOL,
      }),
    );

    // Sign transaction, broadcast, and confirm
    let signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromWallet],
    );

    console.log(signature);
  } catch (err) {
    console.log(err)
    return false;
  }

  return true;
};

export default async (req: any, res: any) => {
  const { method } = req;
  const data = req.body
  let arrAmount = [0.1, 0.25, 0.5]

  // let signatureBalance = await fetch(`https://api.${process.env.NEXT_PUBLIC_SOLANA_NETWORK}.solana.com/`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     "jsonrpc": "2.0",
  //     "id": 1,
  //     "method": "getTransaction",
  //     "params": [
  //       data.signature,
  //       "json"
  //     ]
  //   })
  // });

  // const balance = await signatureBalance.json();
  // console.log(balance)

  // let solAmount = (balance.result.meta.preBalances[0] - balance.result.meta.postBalances[0]) / 1000000000.0;
  // let fromPubKey = balance.result.transaction.message.accountKeys[0]
  // let toPubKey = balance.result.transaction.message.accountKeys[1]

  // load the owner wallet

  let ownerPrivateAddress: any = process.env.NEXT_PUBLIC_OWNER_WALLET
  let ownerWallet = Keypair.fromSecretKey(new Uint8Array(await string2Uint8Array(ownerPrivateAddress)));

  // if (toPubKey != ownerWallet.publicKey.toBase58()) return;

  let randomNum = Math.random();
  let randomChoice;
  (randomNum >= 0.5) ? randomChoice = 'HEAD' : randomChoice = 'TAIL';

  console.log(randomChoice, data.choice)

  if (randomChoice == data.choice) {
    await transferSOL(ownerWallet, data.publicKey, arrAmount[data.amountIndex] * 2)
    res.json({
      success: true,
      choice: randomChoice,
    });
  } else {
    res.json({
      success: false,
      choice: randomChoice,
    });
  }
}