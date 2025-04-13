// Types for reset password response
export interface ResetPasswordResponse {
  success: boolean
  message: string
}

// Types for token validation response
export interface TokenValidationResponse {
  isValid: boolean
  email?: string
  message?: string
}

// Simulate token validation API call
export const validateResetTokenApi = async (token: string): Promise<TokenValidationResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Demo valid tokens (in a real app, these would be stored in a database with expiry times)
  const validTokens = {
    // Admin token
    '123e4567-e89b-12d3-a456-426614174000': {
      email: 'admin@example.com',
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    },
    // User token
    '123e4567-e89b-12d3-a456-426614174001': {
      email: 'user@example.com',
      expires: new Date(Date.now() + 3600000), // 1 hour from now
    },
    // Expired token
    '123e4567-e89b-12d3-a456-426614174002': {
      email: 'expired@example.com',
      expires: new Date(Date.now() - 3600000), // 1 hour ago
    },
  }

  const tokenData = validTokens[token as keyof typeof validTokens]

  if (!tokenData) {
    return {
      isValid: false,
      message: 'Invalid or expired reset token. Please request a new password reset link.',
    }
  }

  if (tokenData.expires < new Date()) {
    return {
      isValid: false,
      message: 'This password reset link has expired. Please request a new one.',
    }
  }

  return {
    isValid: true,
    email: tokenData.email,
  }
}

// Simulate reset password API call
export const resetPasswordApi = async (
  token: string,
  _password: string
): Promise<ResetPasswordResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // First validate the token
  const tokenValidation = await validateResetTokenApi(token)

  if (!tokenValidation.isValid) {
    return {
      success: false,
      message: tokenValidation.message || 'Invalid reset token',
    }
  }

  // In a real app, this would update the password in the database
  return {
    success: true,
    message:
      'Your password has been successfully reset. You can now log in with your new password.',
  }
}

// Password validation
export const validatePassword = (
  password: string,
  confirmPassword: string
): {
  isValid: boolean
  errorMessage?: string
} => {
  // Check if passwords match
  if (password !== confirmPassword) {
    return {
      isValid: false,
      errorMessage: 'Passwords do not match',
    }
  }

  // Check password length
  if (password.length < 8) {
    return {
      isValid: false,
      errorMessage: 'Password must be at least 8 characters long',
    }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one uppercase letter',
    }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one lowercase letter',
    }
  }

  // Check for at least one number
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one number',
    }
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one special character',
    }
  }

  return { isValid: true }
}
