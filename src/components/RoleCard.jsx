export const RoleCard = ({ role, title, description, Icon }) => {
  const { handleRoleSelect, selectedRole } = UserAuth()
  
  return (
    <div 
      className={`role-card cursor-pointer ${selectedRole === role ? 'border-2 border-blue-500' : ''}`}
      onClick={() => handleRoleSelect(role)}
    >
      {/* ... existing card content ... */}
    </div>
  )
}