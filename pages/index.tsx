import Head from "next/head";
import { useState, useEffect } from "react";
import Web3 from "web3";

const MetaMaskPage = () => {
  const [account, setAccount] = useState(null);
  let accounts;
  let userAddress;

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        window.ethereum.enable().then(async () => {
          const web3 = new Web3(window.ethereum);
          accounts = await web3.eth.getAccounts();
          userAddress = accounts[0];
          setAccount(userAddress);

          window.ethereum.on("accountsChanged", async (accounts) => {
            // handle account change
            accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            setAccount(userAddress);
          });

          window.ethereum.on("disconnect", () => {
            // handle metamask logout
            console.log("disconnect");
            setAccount(null);
          });
        });
      } catch (error) {
        if (error.message === "User denied account authorization") {
          // handle the case where the user denied the connection request
        } else if (error.message === "MetaMask is not enabled") {
          // handle the case where MetaMask is not available
        } else {
          // handle other errors
        }
      }
    };
    // call the function
    fetchAccount()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  const getContract = async () => {
    const contract = new web3.eth.Contract(
      process.env.ABI,
      process.env.CONTRACT_ADDRESS
    );

    const data = await contract.methods.getData().call();
    console.log(data);
  };

  const setContract = async () => {
    const contract = new web3.eth.Contract(
      process.env.ABI,
      process.env.CONTRACT_ADDRESS
    );

    const value = 1;
    const gas = await contract.methods.setData(value).estimateGas();

    const gasPrice = await web3.eth.getGasPrice();
    const nonce = await web3.eth.getTransactionCount(userAddress);

    const tx = {
      from: userAddress,
      to: process.env.CONTRACT_ADDRESS,
      gasPrice: gasPrice,
      gas: gas,
      nonce: nonce,
      data: contract.methods.setData(value).encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    if (receipt.status === "0x1") {
      // the transaction was successful
    } else {
      // the transaction failed
    }
  };

  return (
    <>
      <Head>
        <title>MetaMask and Web3.js Integration with Next.js</title>
        <meta
          name="description"
          content="MetaMask and Web3.js Integration with Next.js"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-4">
        {!account ? (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            onClick={() => window.ethereum.enable()}
          >
            Connect to MetaMask
          </button>
        ) : null}
        {account ? (
          <>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              onClick={getContract}
            >
              Get Smart Contract
            </button>
            <button
              className="ml-5 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              onClick={setContract}
            >
              Set Smart Contract
            </button>
            <p className="text-gray-700">Your account address: {account}</p>
          </>
        ) : null}
      </div>
    </>
  );
};

export default MetaMaskPage;
