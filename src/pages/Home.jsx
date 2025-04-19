import { useWeb3Auth } from '../contexts/Web3AuthContext'
import { Button } from '../components/ui/button'
import { Wallet } from 'lucide-react'

const ROLES = [
  {
    title: 'Farmer',
    description: 'Register and manage your agricultural products',
    value: 'farmer'
  },
  {
    title: 'Distributor',
    description: 'Handle product distribution and logistics',
    value: 'distributor'
  },
  {
    title: 'Retailer',
    description: 'Manage retail operations and sales',
    value: 'retailer'
  },
  {
    title: 'Verifier',
    description: 'Verify and validate agricultural products',
    value: 'verifier'
  },
  {
    title: 'Financial Institution',
    description: 'Manage financial operations and transactions',
    value: 'financial'
  },
  {
    title: 'Admin',
    description: 'System administration and oversight',
    value: 'admin'
  }
]

export const Home = () => {
  const { account, loading, userRole, connectWallet, setUserRole } = useWeb3Auth()

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 text-transparent bg-clip-text mb-4">
          Welcome to AgriTrust
        </h1>
        <p className="text-gray-600 text-lg">
          Secure and transparent agricultural supply chain management on the blockchain
        </p>
      </div>

      {!account ? (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to access the platform
          </p>
          <Button
            size="lg"
            onClick={connectWallet}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Wallet className="h-5 w-5" />
            <span>{loading ? 'Connecting...' : 'Connect Wallet'}</span>
          </Button>
        </div>
      ) : !userRole ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Select Your Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map(({ title, description, value }) => (
              <button
                key={value}
                onClick={() => setUserRole(value)}
                className="p-4 border rounded-lg text-left hover:border-indigo-500 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome, {ROLES.find(r => r.value === userRole)?.title}
          </h2>
          <p className="text-gray-600 mb-6">
            You can now access your dashboard and manage your operations
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = `/${userRole}-dashboard`}
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  )
}