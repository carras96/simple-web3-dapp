import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect, useRef } from "react";
import { injected } from "../config/wallets";
import { convertWeiToEther } from "../utils/balance";
import testABI from "../abi/testABI.json";
import { CONTRACT_ADDRESS } from "../config/contractAddress";

export const ConnectButton = () => {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState({} as any);
  const [count, setCount] = useState(0);
  const inputEl = useRef({} as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!library) {
      library.eth.getBalance(account).then((data: number) => {
        setBalance(data);
      });
      setContract((new library.eth.Contract(testABI, CONTRACT_ADDRESS)));
    }
  }, [account, library]);

  useEffect(() => {
    getContractCount();
  }, [contract])

  const connect = async () => {
    try {
      await activate(injected);
      console.log("connected");
    } catch (error) {
      console.log(error);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
      console.log("disconnected");
    } catch (error) {
      console.log(error);
    }
  };

  const incrementContractCount = async () => {
    setLoading(true);
    await contract?.methods?.incrementCount().send({from: account})
    await getContractCount();
    setLoading(false);
  }

  const setContractCount = async () => {
    setLoading(true);
    await contract?.methods?.setCount(Number(inputEl?.current?.value)).send({from: account})
    await getContractCount();
    setLoading(false);
  }

  const getContractCount = async () => {
    let count = await contract?.methods?.count().call()
    console.log(count)
    setCount(count);
  }

  return (
    <>
      {!active ? (
        <button onClick={connect}>Connect to a wallet</button>
      ) : (
        <button onClick={disconnect}>Disconnect</button>
      )}

      {active && (
        <div>
          <p>Your acc: {account}</p>
          <p>Balance: {convertWeiToEther(balance)}</p>
        </div>
      )}
      <br /><br /><br />
      <hr />
      {
        loading && <p>Loading...............................................</p>
      }
      <br /><br /><br />
      <hr />

      <p>Contract count: {count}</p>
      <button onClick={incrementContractCount}>Increment Contract Count </button>
      <br /><br /><br /><br /><br /><br />
      <input type="number" ref={inputEl}/>
      <br /><br /><br />
      <button onClick={setContractCount}>Set Contract Count </button>
    </>
  );
};
