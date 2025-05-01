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
import { supabase } from '../../supabase'; // Import supabase instance

export const SupportCrowdfund = ({ open, onOpenChange, onSupport }) => {
  const [cid, setCid] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!cid) {
        alert('Campaign ID (cid) is missing.');
        return;
      }

      // Check campaign status before contribution
      const beforeStatus = await contract.getCampaignStatus(cid);
      console.log('Status before contribution:', beforeStatus);

      
      

      // Convert amount from fcfa to wei
      const fcfaAmount = amount
      const weiAmount = await contract.fcfaToWei(fcfaAmount)
      // Call the crowdfunding contract function
      const tx = await contract.contributeToCampaign(cid, {value: weiAmount});
      const receipt = await tx.wait(); // Wait for transaction confirmation
      console.log("Contribution successful! TX:", receipt.transactionHash)
      alert('Contribution successful!');

      // Update Supabase with the new amount
      const { data: campaignData, error: campaignError } = await supabase
        .from('crowdfunding_requests')
        .select('current_amount')
        .eq('cid', cid)
        .single();

      if (campaignError) {
        console.error('Error fetching campaign:', campaignError);
      } else {
        const newAmount = Number(campaignData.current_amount) + Number(fcfaAmount);
        const { error: updateError } = await supabase
          .from('crowdfunding_requests')
          .update({ current_amount: newAmount })
          .eq('cid', cid);

        if (updateError) {
          console.error('Error updating campaign:', updateError);
        } else {
          console.log('Successfully updated campaign amount to:', newAmount);
        }
      }

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

      // Check status after contribution
      const afterStatus = await contract.getCampaignStatus(cid);
      console.log('Status after contribution:', afterStatus);

      // Campaign should only be inactive if goal is reached
    if (!afterStatus.active) {
      const raised = Number(ethers.utils.formatEther(afterStatus.raisedAmount));
      const goal = Number(ethers.utils.formatEther(afterStatus.goal));
      console.log(`Campaign ${raised >= goal ? 'completed!' : 'still active'}`);
    }
    } catch (err) {
      console.error('Contribution failed:', err);
      alert('Contribution failed: ' + err.message);
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
            <label className="block mb-1 font-medium">Amount to Contribute (FCFA)</label>
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