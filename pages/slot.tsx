import {
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import { useRef, useState } from "react";

import axios from 'axios'

import useWalletBalance from "../hooks/useWalletBalance";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Slot() {
  const [balance] = useWalletBalance();
  const { connection } = useConnection();
  const { connected, publicKey, signTransaction } = useWallet();

  const [fruit1, setFruit1] = useState("1");
  const [fruit2, setFruit2] = useState("1");
  const [fruit3, setFruit3] = useState("1");
  const [rolling, setRolling] = useState(false);
  let slotRef = [useRef(null), useRef(null), useRef(null)];

  const fruits = [
    "slot/bone.png",
    "slot/duck.png",
    "slot/seven.png",
    "slot/shibatsulogo.png",
    "slot/shibatsutokenheads.png",
    "slot/shibatsutokentails.png"
  ]

  const arrAmount = [0.1, 0.25, 0.5]
  const [amount, setAmount] = useState(0);
  const [earnResult, setEarnResult] = useState('');

  // to trigger roolling and maintain state
  const bet = async () => {
    setEarnResult('')
    if (!publicKey) return

    // get the setting infos
    let result: any = await axios({
      method: 'post',
      url: '/api/owner',
    });

    console.log(result)

    var transaction: any = new Transaction().add(
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
    let signed = await signTransaction(transaction);
    // The signature is generated
    let signature = await connection.sendRawTransaction(signed.serialize());
    // Confirm whether the transaction went through or not
    await connection.confirmTransaction(signature);

    //Signature or the txn hash
    console.log("Signature: ", signature);

    setRolling(true);

    axios({
      method: 'post',
      url: '/api/slot_coin',
      data: {
        signature: signature,
        publicKey: publicKey.toString(),
        amountIndex: amount,
      }
    }).then((res) => {
      console.log(res.data)

      if (res.data.success) {
        setEarnResult('You won')
      } else {
        setEarnResult('You lost')
      }

      // looping through all 3 slots to start rolling
      slotRef.forEach((slot, i) => {
        // this will trigger rolling effect
        const selected = triggerSlotRotation(slot.current, res.data.slot_data[i]);
        if (i + 1 == 1)
          setFruit1(selected);
        else if (i + 1 == 2)
          setFruit2(selected);
        else
          setFruit3(selected);
      });

      setRolling(false);
    }).catch((err) => {

    });

    return
  };

  // this will create a rolling effect and return random selected option
  //@ts-ignore
  const triggerSlotRotation = (ref: any, thing: any) => {
    //@ts-ignore
    function setTop(top) {
      ref.style.top = `${top}px`;
    }
    let options = ref.children;

    let choosenOption = options[thing];

    setTop(-choosenOption.offsetTop + 1);
    return fruits[thing];
  };

  return (
    <>
      <div className="SlotMachine min-h-screen text-center" style={{
        backgroundColor: '#18096b'
      }}>
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl font-bold text-white">Slot</h1>
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

        <div className="text-center" style={{
          backgroundImage: `url("slot/slotmachinebg.png")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          // backgroundSize: 'cover',
          width: '100%',
          paddingTop: '210px',
          paddingBottom: '130px',
        }}>
          <div className="slot">
            <section style={{
              marginLeft: -50
            }}>
              <div className="container" ref={slotRef[0]}>
                {fruits.map((fruit, i) => (
                  <div key={i}>
                    <img className="" src={fruit} alt="" width="256" height="256"></img>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="slot">
            <section style={{
              marginLeft: 30
            }}>
              <div className="container" ref={slotRef[1]}>
                {fruits.map((fruit, i) => (
                  <div key={i}>
                    <img className="" src={fruit} alt="" width="256" height="256"></img>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="slot">
            <section style={{
              marginLeft: 110
            }}>
              <div className="container" ref={slotRef[2]}>
                {fruits.map((fruit, i) => (
                  <div key={i}>
                    <img className="" src={fruit} alt="" width="256" height="256"></img>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="text-center" style={{
            marginTop: 28,
          }}>
            <p className="text-white">FOR {arrAmount[amount]} SOL</p>
            <button
              className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => setAmount(0)}
            >
              {arrAmount[0]} SOL
            </button>
            <button
              className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => setAmount(1)}
            >
              {arrAmount[1]} SOL
            </button>
            <button
              className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => setAmount(2)}
            >
              {arrAmount[2]} SOL
            </button>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              className="px-4 py-2 mx-auto text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600" onClick={() => bet()}
            >
              Bet
            </button>
          </div>
          <p className="text-center text-white">
            {earnResult}
          </p>
        </div>
      </div>

      <style jsx>{`
      .App {
        font-family: sans-serif;
        text-align: center;
      }
      
      .slot {
        position: relative;
        display: inline-block;
        height: 100px;
        width: 80px;
      }
      
      section {
        position: absolute;
        width: 70px;
        height: 70px;
        overflow: hidden;
        color: white;
        font-family: sans-serif;
        text-align: center;
        font-size: 25px;
        line-height: 60px;
        cursor: default;
      }
      
      .container {
        position: absolute;
        top: 2px;
        width: 100%;
        transition: top ease-in-out 0.5s;
        text-align: center;
      }
      
      .roll {
        width: 215px;
        cursor: pointer;
        background-color: yellow;
        padding: 10px;
        text-align: center;
        font-size: 20px;
        border: 3px solid black;
      }
      
      .rolling {
        animation: blinkingText 1.2s infinite;
      }
      
      @keyframes blinkingText {
        0% {
          color: #000;
        }
        49% {
          color: #000;
        }
        60% {
          color: transparent;
        }
        99% {
          color: transparent;
        }
        100% {
          color: #000;
        }
      }
      `}</style>
    </>
  );
}