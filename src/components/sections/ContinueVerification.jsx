import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useState } from 'react'
import { ethers } from "ethers"
import FarmSupplyChain from "../../abi/FarmSupplyChain.json"

export const ContinueVerification = () => {

  const [formData, setFormData] = useState({
    pid: '',
    verificationStage: '',
    verificationStatus: '',
    comment: ''
  })

  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

    console.log(formData)

    try {
      //upload to blockchain
            const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);
      
            const tx = await contract.verifyProducts(
             
              Number(formData.pid),
              Number(formData.verificationStage),
              Number(formData.verificationStatus),
              formData.comment
            );
      
            const receipt = await tx.wait();
            console.log("Product verified! TX:", receipt.transactionHash);
      
            let pid = null;
           // Filter for a specific event by name
      const ProductVerifiedEvents = receipt.events?.filter(
        (x) => x.event === "ProductVerified"
      );
      
      if (ProductVerifiedEvents && ProductVerifiedEvents.length > 0) {
        const event = ProductVerifiedEvents[0];
       pid = event.args.pid.toString();
        const stage = event.args.stage.toString();
        console.log("ProductVerified event args:", ...event.args, pid, stage);
      }
      
    } catch (error) {
      console.error("Error verifying product!",error)
      alert(error.message)
      
    }

  }
  return (
    <div>
 <Dialog>
      <DialogTrigger asChild >
      <Button type='submit' size="sm" className="w-[275px] bg-green-600 hover:bg-green-700 text-white font-medium rounded-full shadow">
                Continue Verification
              </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Continue Verification</DialogTitle>
          <DialogDescription>
          Review and update the verification status for this farm
          </DialogDescription>
        </DialogHeader>
        <form action="" onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">

        <div className="grid grid-cols-2 items-center gap-4">
                  <label htmlFor="productID" className="text-sm font-medium">Product ID (pid)</label>
                  <input 
                    type="number" 
                    id="pid" 
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="0" 
                    value={formData.pid}
                    onChange={handleInputChange}
                  />
                </div>

          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Verification Stage
            </Label>
            <Select onValueChange={handleSelectChange('verificationStage')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Stages</SelectLabel>
                      <SelectItem value="0">Planting stage</SelectItem>
                      <SelectItem value="1">Mid-growth stage</SelectItem>
                      <SelectItem value="2">Harvesting stage</SelectItem>
                      
                    </SelectGroup>
                  </SelectContent>
                </Select>
          </div>
          <div className="grid grid-cols-2 items-center gap-4  ">
            <Label htmlFor="status" className="text-right">
              Verification Status
            </Label>
            <Select onValueChange={handleSelectChange('verificationStatus')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Stages</SelectLabel>
                      <SelectItem value="0">Pending</SelectItem>
                      <SelectItem value="1">Approved</SelectItem>
                      <SelectItem value="2">Rejected</SelectItem>
                      
                    </SelectGroup>
                  </SelectContent>
                </Select>
          </div>

          <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium">Comments </label>
                  <textarea
                    id="comment"
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="Enter a comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                  
                </div>

              
        </div>
        <DialogFooter>
          <Button type="submit" variant="secondary" className="bg-green-600 text-white hover:bg-green-700">Save changes</Button>
        </DialogFooter>
        </form>
       
      </DialogContent>
    </Dialog>
    </div>
  )
}
