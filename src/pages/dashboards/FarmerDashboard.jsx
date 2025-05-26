import { UserAuth } from '../../context/supabaseAuthContext'
import { useWallet } from '../../context/WalletContext'
import { Button } from '../../components/ui/button'
import { PiggyBank, Plus } from 'lucide-react'
import { useState } from 'react'
import { Overview } from '../../components/sections/Overview'
import { Products } from '../../components/sections/Products'
import { Verifications } from '../../components/sections/Verifications'
import { AddProductModal } from '../../components/sections/AddProduct'
import { RequestCrowdfunding } from '../../components/sections/RequestCrowdfunding'
import { ProductProvider } from '../../context/ProductContext';
import { FarmerTransactions } from '../../components/sections/FarmerTransactions'



export const FarmerDashboard = () =>  {
  const { account } = useWallet()
  const { selectedRole } = UserAuth()
  const [activeComponent, setActiveComponent] = useState('')

    const mobileButton = "text-left px-4 py-2 rounded-md"

    const renderComponent = () => {
      switch(activeComponent) {
        case "Overview" :
          return <Overview/>

        case "Products" :
          return <Products/>

        case "Verifications" : 
         return <Verifications/>

        default :
         return <Overview/>
      }
    }

  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-50 p-8">
     

      <div className="max-w-7xl mx-auto font-poppins">
        <div className='flex flex-col items-start justify-start'>
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <div className='grid grid-cols-1 md:grid-cols-2  w-full '>
        <span className='text-gray-600 text-left'>Manage your farm, products and certifications.</span>
        <div className='flex gap-2 pt-4 md:justify-end'>
          <RequestCrowdfunding />
        
          <AddProductModal /> {/* Replace the old button with this component */}
        </div>
        </div>
        </div>


        <div className='nav mt-8 space-y-6'> {/* Added margin-top and vertical spacing */}
          <ul className='flex flex-col sm:flex-row gap-2'> {/* Made it responsive */}
              <li className='flex items-center gap-2 w-full'> {/* Adjusted list item styling */}
                    <Button 
                       variant="ghost" 
                       size="default" 
                       className={` justify-start hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ${mobileButton}`}
                       onClick={() => setActiveComponent("Overview")}
                     >
                       Overview
                     </Button>

                     <Button 
                       variant="ghost" 
                       size="default" 
                       className={` justify-start hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ${mobileButton}`}
                       onClick={() => setActiveComponent("Products")}
                     >
                      Products
                    
                     </Button>

                     <Button 
                       variant="ghost" 
                       size="default" 
                       className={` justify-start hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 ${mobileButton}`}
                       onClick={() => setActiveComponent("Verifications")}
                     >
                       Verifications
                     </Button>
               
              </li>
         
          </ul>
          <div className="mt-4"> {/* Added margin to separate content */}
            {renderComponent()}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="w-full">
            <FarmerTransactions />
          </div>
        </div>
      
      </div>
    </div>
    </ProductProvider>
  )
}