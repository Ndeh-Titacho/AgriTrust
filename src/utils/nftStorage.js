// filepath: c:\Users\HP\Documents\web3\FarmSupplychain\AgriTrust\src\utils\nftStorage.js
import { NFTStorage } from 'nft.storage';

export const createNFTStorageClient = () => {
  const apiKey = import.meta.env.VITE_NFT_STORAGE_API_KEY
  
  if (!apiKey) {
    throw new Error('NFT.Storage API key is missing. Please check your .env file.')
  }
  
  const client = new NFTStorage({ token: apiKey })
  
  return {
    store: async (data) => {
      try {
        return await client.store(data)
      } catch (error) {
        console.error('NFT.Storage error:', error)
        throw new Error('Failed to upload to NFT.Storage')
      }
    }
  }
}