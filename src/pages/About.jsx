import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Leaf, ShieldCheck, Users, BarChart2, HeartHandshake } from 'lucide-react';

export const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Sustainable Farming',
      description: 'Promoting eco-friendly and sustainable agricultural practices for a better tomorrow.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      title: 'Verified Products',
      description: 'Every product is verified through our blockchain-powered supply chain for authenticity.'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'Community Driven',
      description: 'Connecting farmers directly with consumers and verifiers in a trusted ecosystem.'
    },
    {
      icon: <BarChart2 className="w-8 h-8 text-yellow-600" />,
      title: 'Transparent Tracking',
      description: 'Real-time tracking of products from farm to table using blockchain technology.'
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-red-600" />,
      title: 'Fair Trade',
      description: 'Ensuring fair prices for farmers and quality products for consumers.'
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-green-600">AgriTrust</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Revolutionizing the agricultural supply chain with blockchain technology for transparency, trust, and traceability.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <Card className="p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            At AgriTrust, we're committed to creating a transparent and efficient agricultural supply chain that benefits all stakeholders. 
            By leveraging blockchain technology, we ensure that every product's journey from farm to consumer is recorded, verified, and 
            accessible to all parties involved. Our platform empowers farmers, verifiers, and consumers to interact in a secure, 
            decentralized ecosystem that promotes trust and sustainability.
          </p>
        </Card>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Why Choose AgriTrust?</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 h-full">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">How It Works</h2>
        <div className="space-y-8">
          {[
            'Farmers register their products on the AgriTrust platform, creating a digital record on the blockchain.',
            'Verified verifiers validate the farming practices and product quality at various stages.',
            'Each product receives a unique, tamper-proof digital certificate stored on the blockchain.',
            'Consumers can view the complete verification journey of their purchased products.',
            'Smart contracts ensure transparent and fair transactions between all parties.'
          ].map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mr-4 mt-1">
                {index + 1}
              </div>
              <p className="text-gray-700 text-lg">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto text-center bg-green-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join the Agricultural Revolution</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you're a farmer looking to showcase your products, a verifier ensuring quality, or a consumer who values transparency, 
          AgriTrust is building the future of food supply chains.
        </p>
        <button 
          onClick={handleGetStarted}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
