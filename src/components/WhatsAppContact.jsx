import React from 'react'
import { Button } from './ui/button'
import { MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

export const WhatsAppContact = ({ phoneNumber, productName, productId }) => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!phoneNumber) {
      toast.error('Contact number not available')
      return
    }

    try {
      // Format for Cameroon phone numbers
      let formattedNumber = phoneNumber.replace(/\D/g, '')
      formattedNumber = formattedNumber.startsWith('237') ? formattedNumber : `237${formattedNumber}`
      
      const message = encodeURIComponent(`Hello, I'm interested in your product:\n Product ID: ${productId}\n Product Name: ${productName}`)
      const whatsappUrl = `https://wa.me/${formattedNumber}?text=${message}`
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      toast.success('Opening WhatsApp...')
    } catch (error) {
      console.error('Error opening WhatsApp:', error)
      toast.error('Failed to open WhatsApp')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleWhatsAppClick}
      disabled={!phoneNumber}
      className={`flex items-center gap-2 ${
        phoneNumber ? 'text-green-600 hover:text-green-700 hover:bg-green-50' : 'text-gray-400'
      }`}
      title={phoneNumber ? 'Contact seller via WhatsApp' : 'No contact available'}
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Chat</span>
    </Button>
  )
}