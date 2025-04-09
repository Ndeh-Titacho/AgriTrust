export const FarmerDashboard = () => {
  const { account } = useWallet()
  const { selectedRole } = UserAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Farmer Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Connected Wallet: {account}</p>
          <p>Role: {selectedRole}</p>
          {/* Add farmer-specific features here */}
        </div>
      </div>
    </div>
  )
}