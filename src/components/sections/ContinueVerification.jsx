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

export const ContinueVerification = () => {

  const [formData, setFormData] = useState({
    verificationStage: '',
    verificationStatus: ''
  })

  const handleSelectChange = (value) => {
    setFormData({ ...formData, productType: value })
  }

  return (
    <div>
 <Dialog>
      <DialogTrigger asChild >
      <Button size="sm" className="w-[275px] bg-green-600 hover:bg-green-700 text-white font-medium rounded-full shadow">
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Verification Stage
            </Label>
            <Select onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Stages</SelectLabel>
                      <SelectItem value="planting">Planting stage</SelectItem>
                      <SelectItem value="mid-growth">Mid-growth stage</SelectItem>
                      <SelectItem value="harvesting">Harvesting stage</SelectItem>
                      
                    </SelectGroup>
                  </SelectContent>
                </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Verification Status
            </Label>
            <Select onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Stages</SelectLabel>
                      <SelectItem value="planting">Planting stage</SelectItem>
                      <SelectItem value="mid-growth">Mid-growth stage</SelectItem>
                      <SelectItem value="harvesting">Harvesting stage</SelectItem>
                      
                    </SelectGroup>
                  </SelectContent>
                </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}
