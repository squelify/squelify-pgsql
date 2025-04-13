// Types for forgot password response
export interface ForgotPasswordResponse {
  success: boolean
  message: string
}

// Simulate forgot password API call
export const forgotPasswordApi = async (email: string): Promise<ForgotPasswordResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Define valid emails (in a real app, this would check against a database)
  const validEmails = ['admin@example.com', 'user@example.com']

  // Check if email exists
  const isValidEmail = validEmails.includes(email)

  if (isValidEmail) {
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email',
    }
  }

  return {
    success: false,
    message: 'Email not found. Please check your email address and try again.',
  }
}

// Function to validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
