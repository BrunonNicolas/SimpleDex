import { ethers, parseUnits, formatUnits } from 'ethers';
import TokenABI from './TokenABI.json'; // ABI de TokenA

const tokenAddress = '0xcBcf9B8C3E12614D36EF0ef03d37A60426baf72D'; // Dirección del contrato TokenA

let provider, signer, tokenContract;

// Verifica si Metamask está instalado
if (typeof window.ethereum !== 'undefined') {
  provider = new ethers.Web3Provider(window.ethereum);

  // Solicitar acceso a la cuenta de Metamask
  window.ethereum.request({ method: 'eth_requestAccounts' }).then(async () => {
    signer = provider.getSigner(); // Obtener el signer de Metamask
    tokenContract = new ethers.Contract(tokenAddress, TokenABI, signer);
    console.log('Conexión exitosa con la billetera');
  }).catch((error) => {
    console.error("El usuario denegó el acceso a la cuenta:", error);
  });
} else {
  console.error("Metamask no está instalado.");
}

// Función para obtener el saldo de un usuario
export const getBalance = async (account) => {
  if (!tokenContract) {
    console.error('Contrato no disponible');
    return;
  }

  try {
    const balance = await tokenContract.balanceOf(account);
    return formatUnits(balance, 18); // Ajusta las decimales si es necesario
  } catch (error) {
    console.error("Error al obtener el saldo:", error);
  }
};

// Función para transferir tokens
export const transferTokens = async (to, amount) => {
  if (!tokenContract) {
    console.error('Contrato no disponible');
    return;
  }

  try {
    const tx = await tokenContract.transfer(to, parseUnits(amount, 18));
    await tx.wait();
    console.log('¡Tokens transferidos!');
  } catch (err) {
    console.error('Error al transferir tokens:', err);
  }
};
