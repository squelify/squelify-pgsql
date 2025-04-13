// Types for login response
export interface LoginResponse {
  success: boolean
  user?: {
    name: string
    email: string
    role?: string
  }
  message?: string
}

// Simulate login API call with better typing
export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Define valid credentials
  const validCredentials = {
    'admin@example.com': {
      password: 'admin123',
      user: { name: 'Admin User', email, role: 'administrator' },
    },
    'user@example.com': {
      password: 'password123',
      user: { name: 'Regular User', email, role: 'user' },
    },
  }

  // Check if email exists and password matches
  const userCredential = validCredentials[email as keyof typeof validCredentials]

  return userCredential && userCredential.password === password
    ? { success: true, user: userCredential.user }
    : {
        success: false,
        message: 'Invalid email or password. Try admin@example.com / admin123',
      }
}

// Function to store user data
export const storeUserData = (user: LoginResponse['user'], rememberMe: boolean) => {
  if (!user) return

  const userData = {
    ...user,
    token: `demo-token-${Date.now()}`,
    lastLogin: new Date().toISOString(),
  }

  const storageMethod = rememberMe ? localStorage : sessionStorage
  storageMethod.setItem('squelify_user', JSON.stringify(userData))

  return userData
}

// Function to determine redirect path based on user role
export const getRedirectPath = (role?: string) => {
  const paths = {
    administrator: '/',
    user: '/account',
    default: '/',
  }

  return paths[role as keyof typeof paths] || paths.default
}
