import React from 'react';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-2">General Inquiries</h4>
                <p className="text-gray-600">Email: info@agritrust.com</p>
                <p className="text-gray-600">Phone: +237 652962750</p>
                <p className="text-gray-600">Hours: Mon-Fri, 9:00 AM - 5:00 PM</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Technical Support</h4>
                <p className="text-gray-600">Email: support@agritrust.com</p>
                <p className="text-gray-600">Phone: +237 652962750</p>
                <p className="text-gray-600">Hours: 24/7</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2">Business Development</h4>
                <p className="text-gray-600">Email: business@agritrust.com</p>
                <p className="text-gray-600">Phone: +237 652962750</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" rows="5" required></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Our Location</h3>
          <p className="text-gray-600">AgriTrust Bambili</p>
        
          <p className="text-gray-600">North West, Bamenda</p>
          <p className="text-gray-600">Cameroon</p>
        </div>
      </div>
    </div>
  );
};

export { Contact };
