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
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

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
  } catch (error) {
    return false;
  }

  return true;
};

export default async (req: any, res: any) => {
  const { method } = req;
  const data = req.body

  let arrAmount = [0.1, 0.25, 0.5]
  // let signatureBalance = await fetch(`https://api.devnet.solana.com/`, {
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

  // let solAmount = (balance.result.meta.preBalances[0] - balance.result.meta.postBalances[0]) / 1000000000.0;
  // let fromPubKey = balance.result.transaction.message.accountKeys[0]
  // let toPubKey = balance.result.transaction.message.accountKeys[1]

  // load the owner wallet
  let ownerPrivateAddress : any = process.env.NEXT_PUBLIC_OWNER_WALLET
  let ownerWallet = Keypair.fromSecretKey(new Uint8Array(await string2Uint8Array(ownerPrivateAddress)));

  // if (toPubKey != ownerWallet.publicKey.toBase58()) return;

  let random1: any = Math.floor(
    Math.random() * 6
  );

  let random2: any = Math.floor(
    Math.random() * 6
  );

  let random3: any = Math.floor(
    Math.random() * 6
  );

  if (random1 == random2 && random2 == random3) {
    await transferSOL(ownerWallet, data.publicKey, arrAmount[data.amountIndex] * 2)
    res.json({
      success: true,
      slot_data: [random1, random2, random3]
    });
  } else if (random1 == random2 || random2 == random3 || random1 == random3) {
    await transferSOL(ownerWallet, data.publicKey, arrAmount[data.amountIndex] * 1.5)
    res.json({
      success: true,
      slot_data: [random1, random2, random3]
    });
  } else {
    res.json({
      success: false,
      slot_data: [random1, random2, random3]
    });
  }
}
