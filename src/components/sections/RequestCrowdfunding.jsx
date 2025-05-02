import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Plus, Wallet, Calendar, PiggyBank } from 'lucide-react';
import { supabase } from "../../supabase";
import { toast } from 'react-hot-toast';
import FarmSupplyChain from "../../abi/FarmSupplyChain.json";
import { ethers } from "ethers";

export const RequestCrowdfunding = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    duration: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
  if (
    !formData.description ||
    !formData.amount ||
    !formData.duration ||
    isNaN(Number(formData.amount)) ||
    isNaN(Number(formData.duration))
  ) {
    console.error("Please fill out all fields with valid values.");
    return;
  }


    try {


      //upload to blockchain
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);

     
      const amountInWei = await contract.fcfaToWei(Number(formData.amount));
      const tx = await contract.startCrowdfundingCampaign(
        formData.description,
        amountInWei,
        Number(formData.duration),
        
        
      );

     

      const receipt = await tx.wait();
      console.log("Campaign started! TX:", receipt.transactionHash);
     // Filter for a specific event by name

// Log all events
console.log("All events:", receipt.events);

// Filter for the 'CrowdfundingStarted' event
const crowdfundingEvents = receipt.events?.filter(
  (event) => event.event === "CrowdfundingStarted"
);

console.log("CrowdfundingStarted events:", crowdfundingEvents);

// If you want to log the arguments of the first event
let cid = null; // Declare cid in the outer scope

if (crowdfundingEvents && crowdfundingEvents.length > 0) {
  const event = crowdfundingEvents[0];
  console.log("Event args:", event.args);
  console.log("cid:", event.args.cid.toString());
  console.log("goal in FCFA:", formData.amount + "XAF");
  console.log("goal in wei:", event.args.goal.toString());
  console.log("duration:", formData.duration + " days");
  cid = event.args.cid.toString();
}

      const { error } = await supabase
        .from('crowdfunding_requests')
        .insert([
          {
            cid: cid,
            title: formData.title,
            target_amount:parseFloat(formData.amount),
            duration_days: parseInt(formData.duration),
            description: formData.description,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      toast.success('Crowdfunding request submitted successfully!');
      setOpen(false);
      setFormData({
        title: '',
        amount: '',
        duration: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting crowdfunding request:', error);
      toast.error('Failed to submit crowdfunding request');
    }
  };

  return (
    <>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className=" hover:bg-blue-500 hover:text-white ">
            <PiggyBank size={16} className="mr-2" />
            Request Crowdfunding
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className='flex items-center gap-1'>
            <PiggyBank size={20} className="mr-2 text-green-600" />
            <DialogTitle>Request Crowdfunding</DialogTitle>
            </div>
         
            <DialogDescription>
              Fill in the details for your crowdfunding request
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Project Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Target Amount (XAF)</label>
              <Input
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter target amount"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Campaign Duration</label>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Enter duration in days"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Project Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project and how the funds will be used"
                className="w-full min-h-[100px]"
              />
            </div>

            <DialogFooter>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};