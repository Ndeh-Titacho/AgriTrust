import React, { useState } from 'react';
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

export const SupportCrowdfund = ({ open, onOpenChange, onSupport }) => {
  const [cid, setCid] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  

     try {
    
          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);
          // You may want to show a loading state here
          if (!cid) {
            alert('Campaign ID (cid) is missing.');
            return;
          }
          //convert amount from fcfa to wei
          const fcfaAmount = amount
          const weiAmount = await contract.fcfaToWei(fcfaAmount)
          // Call the crowdfunding contract function
          const tx = await contract.contributeToCampaign(cid, {value: weiAmount});
          await tx.wait(); // Wait for transaction confirmation
          console.log("Contribution successful! TX:", receipt.transactionHash)
          alert('Contribution successful!');
    
          // Log all events
    
    
    // Filter for the 'CrowdfundingContribution' event
    const CrowdfundingContributionEvents = receipt.events?.filter(
      (event) => event.event === "CrowdfundingContribution"
    );
    
    console.log("CrowdfundingContribution events:", CrowdfundingContributionEvents);
    
    
    if (CrowdfundingContributionEvents && CrowdfundingContributionEvents.length > 0) {
      const event = CrowdfundingContributionEvents[0];
      console.log("Event args:", event.args);
      console.log("cid:", event.args.cid.toString());
      console.log("Amount:", event.args.amount.toString());
      console.log("Contributor:", event.args.contributor.toString());
    }
    
        } catch (err) {
          console.error('Contribution failed:', err);
          alert('Contribution failed: ' + (err?.message || err));
        }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogTrigger asChild>
         <Button className="bg-green-600 hover:bg-green-700 text-white">Support</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support a Crowdfund Campaign</DialogTitle>
          <DialogDescription>
            Enter the details below to support a campaign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Campaign ID (cid)</label>
            <input
              type="text"
              value={cid}
              onChange={e => setCid(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Amount to Contribute (ETH)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message (optional)</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Support
              </button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupportCrowdfund;