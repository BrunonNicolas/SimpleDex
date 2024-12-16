import { ethers, parseUnits, formatUnits } from 'ethers';
import SimpleDEXABI from './SimpleDEXABI.json'; // Asegúrate de que el ABI esté correcto

const contractAddress = '0xF8EE2d1b4eb15d8DAAD87ae93429f89D624F2502'; // Dirección del contrato SimpleDEX

let provider, signer, simpleDEXContract;

// Verifica si Metamask está instalado
if (typeof window.ethereum !== 'undefined') {
  provider = new ethers.Web3Provider(window.ethereum);

  // Solicitar acceso a la cuenta de Metamask
  window.ethereum.request({ method: 'eth_requestAccounts' }).then(async () => {
    signer = provider.getSigner(); // Obtener el signer de Metamask
    simpleDEXContract = new ethers.Contract(contractAddress, SimpleDEXABI, signer);
    console.log('Conexión exitosa con la billetera');
  }).catch((error) => {
    console.error("El usuario denegó el acceso a la cuenta:", error);
  });
} else {
  console.error("Metamask no está instalado.");
}

// Función para agregar liquidez
export const addLiquidity = async (tokenA, tokenB, amountA, amountB) => {
  if (!simpleDEXContract) {
    console.error('Contrato no está disponible');
    return;
  }

  try {
    const tx = await simpleDEXContract.addLiquidity(
      tokenA,
      tokenB,
      parseUnits(amountA, 18),
      parseUnits(amountB, 18)
    );
    await tx.wait();
    console.log('¡Liquidez agregada!');
  } catch (err) {
    console.error('Error al agregar liquidez:', err);
  }
};

// Función para intercambiar tokens
export const swapTokens = async (tokenA, tokenB, amountA, amountB) => {
  if (!simpleDEXContract) {
    console.error('Contrato no está disponible');
    return;
  }

  try {
    const tx = await simpleDEXContract.swap(
      tokenA,
      tokenB,
      parseUnits(amountA, 18),
      parseUnits(amountB, 18)
    );
    await tx.wait();
    console.log('¡Tokens intercambiados!');
  } catch (err) {
    console.error('Error al intercambiar tokens:', err);
  }
};
