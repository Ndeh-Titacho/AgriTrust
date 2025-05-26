import { WhatsAppContact } from '../WhatsAppContact'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

export const ProductCard = ({ product }) => {
    const [farmerContact, setFarmerContact] = useState(null)

    useEffect(() => {
        const getFarmerContact = async () => {
            try {
                const { data, error } = await supabase
                    .from('web3_users')
                    .select('phone_number')
                    .eq('wallet_address', product.farmer)
                    .single()

                if (error) throw error
                setFarmerContact(data?.phone_number)
            } catch (error) {
                console.error('Error fetching farmer contact:', error)
            }
        }

        getFarmerContact()
    }, [product.farmer])

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {/* ...existing product details... */}
            
            {farmerContact && (
                <div className="mt-4">
                    <WhatsAppContact 
                        phoneNumber={farmerContact}
                        productName={product.name}
                    />
                </div>
            )}
        </div>
    )
}