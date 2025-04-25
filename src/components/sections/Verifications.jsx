import React from 'react'
import VerificationProgress from './VerificationProgress'

export const Verifications = () => {

  const stagesStatus = {
    planting: 'approved',
    midGrowth: 'pending',
    harvest: 'pending',
    processing: 'pending'
  };
  return (
    <div>
      <VerificationProgress stagesStatus={stagesStatus} />
    </div>
  )
}
