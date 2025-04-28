import React from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { supabase } from "../../supabase"
import { toast } from "sonner"
import { Toaster } from "sonner"
import { ethers } from "ethers"
import FarmSupplyChain from "../../abi/FarmSupplyChain.json"

export const AddProductModal = () => {
  const [open, setOpen] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState(null)
  const [formData, setFormData] = React.useState({
    productName: '',
    productType: '',
    productPrice: '',
    inventory: '',
    productDescription: '',
    productImage: null,
    farmingInputs: '',
  })

  const handleClose = () => {
    setOpen(false)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
          // Store the base64 data URL in state
          setFormData({ ...formData, productImage: reader.result })
          
          // Show success toast
          toast.success(`Image uploaded successfully (${file.name})`)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        // Show error toast
        toast.error('Failed to upload image')
        console.error('Error uploading image:', error)
      }
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = (value) => {
    setFormData({ ...formData, productType: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Show loading toast
      toast.loading('Uploading product...')

      //upload to blockchain
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, FarmSupplyChain.abi, signer);

      const farmingInputsArray = formData.farmingInputs.split(',').map((s) => s.trim());

      const tx = await contract.listProduct(
        formData.productName,
        Number(formData.inventory),
        formData.productDescription,
        Number(formData.productPrice),
        farmingInputsArray
      );

      const product = await contract.getProduct(1);
      console.log(product)

      const receipt = await tx.wait();
      console.log("Product listed! TX:", receipt.transactionHash);

      let pid = null
     // Filter for a specific event by name
const productListedEvents = receipt.events?.filter(
  (x) => x.event === "ProductListed"
);

if (productListedEvents && productListedEvents.length > 0) {
  const event = productListedEvents[0];
 pid = event.args.pid.toString();
  const price = event.args.price.toString();
  console.log("ProductListed event args:", ...event.args, pid, price);
}
     
      //upload to supabase
      const { error } = await supabase
        .from('products')
        .insert({
          pid: pid,
          name: formData.productName,
          type: formData.productType,
          price: parseFloat(formData.productPrice),
          inventory: parseInt(formData.inventory),
          description: formData.productDescription,
          farmingInputs: formData.farmingInputs,
          image_url: formData.productImage,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      // Show success toast
      toast.success("Product uploaded successfully!")
      
      // Reset form and close modal
      setFormData({
        productName: '',
        productType: '',
        productPrice: '',
        inventory: '',
        productDescription: '',
        farmingInputs: '',
        productImage: null,
      })
      setImagePreview(null)
      setOpen(false)
      
    } catch (error) {
      // Show error toast
      toast.error(error.message || "Failed to upload product")
      console.error('Error uploading product:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} className="font-poppins">
      <DialogTrigger asChild>
        <Button variant="secondary" className="bg-green-600 text-white hover:bg-green-500">
          <Plus /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1 pb-2">
          <DialogTitle className="flex items-center gap-1">
            <Plus className='text-green-600'/> 
            Add New Product
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter the details of your new product here.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="productName" className="text-sm font-medium">Product Name</label>
                <input 
                  type="text" 
                  id="productName" 
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Enter product name" 
                  value={formData.productName}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="productType" className="text-sm font-medium">Product Type</label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="productPrice" className="text-sm font-medium">Price</label>
                  <input 
                    type="number" 
                    id="productPrice" 
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="Enter price" 
                    value={formData.productPrice}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="inventory" className="text-sm font-medium">Inventory</label>
                  <input 
                    type="number" 
                    id="inventory" 
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="0" 
                    value={formData.inventory}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="farmingInputs" className="text-sm font-medium">Farming Inputs</label>
                  <textarea
                    id="farmingInputs"
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholder="Enter farming inputs, separated by commas"
                    value={formData.farmingInputs}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                  
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div className="space-y-2">
                <label htmlFor="productDescription" className="text-sm font-medium">Description</label>
                <textarea 
                  id="productDescription" 
                  className="w-full rounded-md border border-gray-300 p-2 min-h-[80px]"
                  placeholder="Enter product description" 
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label htmlFor="productImage" className="text-sm font-medium">Product Image</label>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    {imagePreview && (
                      <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Product preview" 
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    )}
                    <input 
                      type="file" 
                      id="productImage" 
                      accept="image/*" 
                      className="w-full"
                      required 
                      onChange={handleImageChange}
                    />
                  </div>
                  {!imagePreview && (
                    <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={() => setImagePreview(false)}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="secondary" type="submit" className="bg-green-600 text-white hover:bg-green-500">
              Save Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
