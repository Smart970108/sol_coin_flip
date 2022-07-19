import {
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useState } from "react";

import useCandyMachine from "../hooks/useCandyMachine";
import useWalletBalance from "../hooks/useWalletBalance";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import { Toaster } from "react-hot-toast";
import Countdown from "react-countdown";
import useWalletNfts from "../hooks/useWalletNFTs";
import AnNFT from "../components/AnNFT/AnNFT";

import axios from 'axios'

export default function Home() {
  const [balance] = useWalletBalance();
  const {
    isSoldOut,
    mintStartDate,
    isMinting,
    startMint,
    startMintMultiple,
    nftsData,
  } = useCandyMachine();

  // flip the sol
  const flipSol = async (choice: any) => {
    setEarnResult('')
    if (!publicKey) return

    // get the setting infos
    let result: any = await axios({
      method: 'post',
      url: '/api/owner',
    });

    var transaction: Transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(result.data.pubKey), // owner's public key
        lamports: arrAmount[amount] * LAMPORTS_PER_SOL // Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
      }),
    );

    // Setting the variables for the transaction
    transaction.feePayer = publicKey;
    let blockhashObj: any = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    // Transaction constructor initialized successfully
    if (transaction) {
      console.log("Txn created successfully");
    }

    // Request creator to sign the transaction (allow the transaction)
    // @ts-ignore
    signTransaction(transaction).then(async (signed) => {
      // The signature is generated
      connection.sendRawTransaction(signed.serialize()).then(async (signature: any) => {
        setFlipping(true)
        // Confirm whether the transaction went through or not
        await connection.confirmTransaction(signature);

        //Signature or the txn hash
        console.log("Signature: ", signature);

        axios({
          method: 'post',
          url: '/api/flip_coin',
          data: {
            signature: signature,
            publicKey: publicKey.toString(),
            choice: choice,
            amountIndex: amount,
          }
        }).then((res) => {
          if (res.data.success) {
            setEarnResult('You won')
          } else {
            setEarnResult('You lost')
          }

          if (res.data.choice == 'HEAD') {
            setHead(true)
          } else {
            setHead(false)
          }

          setFlipping(false)
        }).catch((err) => {

        });
      }).catch((err: any) => {
        console.log(err)
      })
    }).catch((err: any) => { // reject the request or etc
      console.log(err)
    });
  }

  const { connection } = useConnection();
  const { connected, publicKey, signTransaction } = useWallet();

  const [amount, setAmount] = useState(0);
  const [earnResult, setEarnResult] = useState('');

  const [flipping, setFlipping] = useState(false);
  const [head, setHead] = useState(true)

  const arrAmount = [0.1, 0.25, 0.5]

  return (
    <>
      <Head>
        <title>Coin Flip</title>
        <meta
          name="description"
          content="Simplified NextJs with typescript example app integrated with Metaplex's Candy Machine"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/fonts/RetroGaming.ttf"></link>
      </Head>

      <div className="flex flex-col items-center min-h-screen" style={{
        backgroundImage: `url("shibatsubg.png")`,
        backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center',
        backgroundSize: 'cover',
        width: '100vw',
      }}>
        <Toaster />
        <div className="flex items-center justify-between w-full mt-3">
          <h1 className="text-2xl font-bold text-white">Coinflip</h1>
          <div className="flex items-center">
            {connected && (
              <div className="flex items-end mr-2">
                <p className="text-xs text-white">Balance</p>
                <p className="mx-1 font-bold text-white leading-none">
                  {balance.toFixed(2)}
                </p>
                <p
                  className="font-bold leading-none text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, #00FFA3, #03E1FF, #DC1FFF)`,
                  }}
                >
                  SOL
                </p>
              </div>
            )}
            <WalletMultiButton />
          </div>
        </div>
        <div>
          {flipping ? (
            <>
            </>
          ) : (
            <>
              {head ? (
                <>
                  <img className="logo rounded-circle" src="/896fn7R_head.png" alt="" width="256" height="256"></img>
                </>
              ) : (
                <>
                  <img className="logo rounded-circle" src="/896fn7R_back.png" alt="" width="256" height="256"></img>
                </>
              )}
            </>
          )}
        </div>

        <div className="">
          {connected ? (
            <>
              {flipping ? (
                <>
                  <img className="logo rounded-circle" src="/shibaheads.gif" alt="" width="256" height="256"></img>
                  <p className="text-white text-center">Flipping ...</p>
                </>
              ) : (
                <>
                  <div className="text-center my-5">
                    <p className="text-white">FOR {arrAmount[amount]} SOL</p>
                    <button
                      className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => setAmount(0)}
                    >
                      0.1 SOL
                    </button>
                    <button
                      className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => setAmount(1)}
                    >
                      0.25 SOL
                    </button>
                    <button
                      className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => setAmount(2)}
                    >
                      .5 SOL
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => flipSol('HEAD')}
                    >
                      Bet HEAD
                    </button>
                    <button
                      className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => flipSol('TAIL')}
                    >
                      Bet TAIL
                    </button>
                  </div>
                  <p className="text-center text-white">
                    {earnResult}
                  </p>
                </>
              )}
            </>
          ) : (
            <p className="text-white">connect wallet to flip</p>
          )}
        </div>
      </div >
    </>
  );
}
