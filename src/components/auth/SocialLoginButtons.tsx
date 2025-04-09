// src/components/auth/SocialLoginButtons.tsx

import React from 'react'

// ⬅️ Hier importierst du dein Icon
import { ReactComponent as GoogleIcon } from '@/assets/icons/google/google.svg'

const SocialLoginButtons = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* ⬇️ Hier wird das Icon angezeigt */}
      <GoogleIcon className="w-6 h-6 mr-2" />
      <span>Mit Google anmelden</span>
    </div>
  )
}

export default SocialLoginButtons
