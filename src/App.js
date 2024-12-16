import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import tokenAABI from './contracts/TokenABI.json';
import tokenBABI from './contracts/TokenBABI.json';
import dexABI from './contracts/SimpleDEXABI.json';

const tokenAAddress = '0xcBcf9B8C3E12614D36EF0ef03d37A60426baf72D';
const tokenBAddress = '0x7413B8f82f1C6eF3A79730Baa7570575De61e742';
const dexAddress = '0xF8EE2d1b4eb15d8DAAD87ae93429f89D624F2502';

let web3, tokenAContract, tokenBContract, dexContract;

const App = () => {
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState('');
  const [network, setNetwork] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      tokenAContract = new web3.eth.Contract(tokenAABI, tokenAAddress);
      tokenBContract = new web3.eth.Contract(tokenBABI, tokenBAddress);
      dexContract = new web3.eth.Contract(dexABI, dexAddress);
    } else {
      alert('MetaMask no detectado. Por favor instala MetaMask.');
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask no detectado');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      const chainId = await web3.eth.getChainId();

      const networkName = getNetworkName(chainId);

      setUserAddress(accounts[0]);
      setUserBalance(web3.utils.fromWei(balance, 'ether') + ' ETH');
      setNetwork(networkName);
      setIsWalletConnected(true);
    } catch (error) {
      alert('Error conectando la billetera: ' + error.message);
    }
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  const approveSwap = async () => {
    try {
      if (!isWalletConnected) throw new Error('Por favor conecta tu billetera primero');
      const amount = web3.utils.toWei('1', 'ether');
      await tokenAContract.methods.approve(dexAddress, amount).send({ from: userAddress });
      alert('Aprobado para intercambio');
    } catch (error) {
      console.error('Error aprobando intercambio:', error.message);
    }
  };

  const swapTokens = async () => {
    try {
      if (!isWalletConnected) throw new Error('Por favor conecta tu billetera primero');
      const amountIn = web3.utils.toWei('1', 'ether');
      const amountOutMin = web3.utils.toWei('0.9', 'ether');
      await dexContract.methods.swapTokens(amountIn, amountOutMin).send({ from: userAddress });
      alert('Intercambio realizado con éxito');
    } catch (error) {
      console.error('Error intercambiando tokens:', error.message);
    }
  };

  const approveLiquidity = async () => {
    try {
      if (!isWalletConnected) throw new Error('Por favor conecta tu billetera primero');
      const amount = web3.utils.toWei('10', 'ether');
      await tokenAContract.methods.approve(dexAddress, amount).send({ from: userAddress });
      await tokenBContract.methods.approve(dexAddress, amount).send({ from: userAddress });
      alert('Liquidez aprobada');
    } catch (error) {
      console.error('Error aprobando liquidez:', error.message);
    }
  };

  const addLiquidity = async () => {
    try {
      if (!isWalletConnected) throw new Error('Por favor conecta tu billetera primero');
      const amountA = web3.utils.toWei('10', 'ether');
      const amountB = web3.utils.toWei('10', 'ether');
      await dexContract.methods.addLiquidity(amountA, amountB).send({ from: userAddress });
      alert('Liquidez añadida');
    } catch (error) {
      console.error('Error añadiendo liquidez:', error.message);
    }
  };

  return (
    <div>
      <h1>DeFi DApp</h1>
      <button onClick={connectWallet}>Conectar Billetera</button>
      {isWalletConnected && (
        <div>
          <p><strong>Dirección:</strong> {userAddress}</p>
          <p><strong>Red:</strong> {network}</p>
          <p><strong>Balance:</strong> {userBalance}</p>
          <button onClick={approveSwap}>Aprobar Intercambio</button>
          <button onClick={swapTokens}>Intercambiar Tokens</button>
          <button onClick={approveLiquidity}>Aprobar Liquidez</button>
          <button onClick={addLiquidity}>Agregar Liquidez</button>
        </div>
      )}
    </div>
  );
};

export default App;
