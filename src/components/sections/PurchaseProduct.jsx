import React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "../ui/dialog";
import { Button } from '../ui/button';
import { ethers } from "ethers"
import FarmSupplyChain from "../../abi/FarmSupplyChain.json"
import { toast } from 'sonner'

export const PurchaseProduct = ({ product, triggerLabel = "Purchase" }) => {
  const { name, pid, price } = product || {};

  const confirmPurchase = async () => {
    try {
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);
      const weiAmount = await contract.fcfaToWei(price);
      const tx = await contract.purchaseProduct(pid, {value: weiAmount});
      const receipt = await tx.wait();
      console.log("Product purchased! TX:", receipt.transactionHash);
      toast.success("Product purchased successfully!")
    } catch (error) {
      console.error("Error purchasing product:", error)
      toast.error(error.message)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Product</DialogTitle>
          <DialogDescription>
            Review the product details before confirming your purchase.
          </DialogDescription>
        </DialogHeader>
        {product ? (
          <div className="mb-4">
            <div className="font-medium">Product Name:</div>
            <div className="mb-2">{name}</div>
            <div className="font-medium">Product ID (pid):</div>
            <div className="mb-2">{pid}</div>
            <div className="font-medium">Price:</div>
            <div className="mb-2">{price} XAF</div>
          </div>
        ) : (
          <div className="mb-4 text-red-500">No product selected.</div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              onClick={async (e) => {
                e.preventDefault();
                await confirmPurchase();
              }}
              disabled={!product}
            >
              Confirm Purchase
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseProduct;
