import React from 'react'

interface AdminGuardProps {
  children: React.ReactNode
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  return (
    <div className="admin-protected">
      {children}
    </div>
  )
}

export default AdminGuard
