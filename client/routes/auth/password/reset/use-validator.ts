// Function to validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Function to validate token from URL
export const validateToken = (
  token?: string | null
): {
  isValid: boolean
  errorMessage?: string
} => {
  // Check if token exists
  if (!token) {
    return {
      isValid: false,
      errorMessage: 'Reset token is missing. Please use the link from your email.',
    }
  }

  // Check if token has valid UUID format
  if (!isValidUUID(token)) {
    return {
      isValid: false,
      errorMessage: 'Invalid reset token format. Please use the link from your email.',
    }
  }

  return { isValid: true }
}
