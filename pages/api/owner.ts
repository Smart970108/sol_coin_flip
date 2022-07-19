import Base58 from 'bs58'
import {
  Keypair,
  Connection,
  clusterApiUrl,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const string2Uint8Array = async (str : any) => {
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

export default async (req : any, res : any) => {
  const { method } = req;

  let ownerPrivateAddress : any = process.env.NEXT_PUBLIC_OWNER_WALLET
  // load the owner wallet
  let ownerWallet = Keypair.fromSecretKey(new Uint8Array(await string2Uint8Array(ownerPrivateAddress)));

  res.json({ 
    pubKey: ownerWallet.publicKey.toString() 
  });
}