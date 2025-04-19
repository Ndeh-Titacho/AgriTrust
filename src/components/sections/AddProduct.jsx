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
import { createNFTStorageClient } from '../../utils/nftStorage' // Import the NFT.Storage client

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
  })

  const handleClose = () => {
    setOpen(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setFormData({ ...formData, productImage: file })
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
      const nftStorage = createNFTStorageClient()
      
      // Create a proper File object
      const imageFile = new File(
        [formData.productImage], 
        formData.productImage.name, 
        { type: formData.productImage.type }
      )
      
      // Upload to NFT.Storage
      const metadata = await nftStorage.store({
        name: formData.productName,
        description: formData.productDescription,
        image: imageFile
      })
      
      // Insert into Supabase
      const { error } = await supabase
        .from('products')
        .insert({
          name: formData.productName,
          type: formData.productType,
          price: parseFloat(formData.productPrice),
          inventory: parseInt(formData.inventory),
          description: formData.productDescription,
          image_url: `https://ipfs.io/ipfs/${metadata.data.image.href.split('//')[1]}`,
          nft_metadata_url: metadata.url
        })
      
      if (error) throw error
      
      alert('Product added successfully!')
      setOpen(false)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add product: ' + error.message)
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
