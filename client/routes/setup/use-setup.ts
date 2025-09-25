// Types for setup response
export interface SetupResponse {
  success: boolean
  message: string
}

// Types for token validation response
export interface TokenValidationResponse {
  isValid: boolean
  isInstalled: boolean
  message?: string
}

// Types for admin user creation
export interface AdminUserData {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  newsletter: boolean
}

// Simulate token validation API call
export const validateSetupTokenApi = async (token: string): Promise<TokenValidationResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Demo valid setup token (in a real app, this would be stored securely)
  const validSetupToken = '123e4567-e89b-12d3-a456-426614174099'

  // Check if token is valid
  if (token !== validSetupToken) {
    return {
      isValid: false,
      isInstalled: false,
      message: 'Invalid setup token. Please use the correct setup link.',
    }
  }

  // Simulate checking if app is already installed (has admin user)
  const isInstalled = false // In real app, this would check the database

  if (isInstalled) {
    return {
      isValid: true,
      isInstalled: true,
      message: 'Application is already set up. Please log in with your admin credentials.',
    }
  }

  return {
    isValid: true,
    isInstalled: false,
  }
}

// Simulate admin user creation API call
export const createAdminUserApi = async (
  token: string,
  _userData: AdminUserData
): Promise<SetupResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // First validate the token
  const tokenValidation = await validateSetupTokenApi(token)

  if (!tokenValidation.isValid) {
    return {
      success: false,
      message: tokenValidation.message || 'Invalid setup token',
    }
  }

  if (tokenValidation.isInstalled) {
    return {
      success: false,
      message: 'Application is already set up. Please log in with your admin credentials.',
    }
  }

  // In a real app, this would create the admin user in the database
  return {
    success: true,
    message: 'Setup completed successfully. You can now log in with your admin credentials.',
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
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one special character',
    }
  }

  return { isValid: true }
}

// Email validation
export const validateEmail = (
  email: string
): {
  isValid: boolean
  errorMessage?: string
} => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid email address',
    }
  }

  return { isValid: true }
}

// Function to validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Function to validate setup token from URL
export const validateSetupToken = (
  token?: string | null
): {
  isValid: boolean
  errorMessage?: string
} => {
  // Check if token exists
  if (!token) {
    return {
      isValid: false,
      errorMessage: 'Setup token is missing. Please use the correct setup link.',
    }
  }

  // Check if token has valid UUID format
  if (!isValidUUID(token)) {
    return {
      isValid: false,
      errorMessage: 'Invalid setup token format. Please use the correct setup link.',
    }
  }

  return { isValid: true }
}
