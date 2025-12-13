import { axios } from '@/plugins/axios'

/**
 * Register new user
 * @param {Object} data - { name, email, password }
 * @returns {Promise}
 */
export async function register(data) {
  try {
    const response = await axios.post('/api/auth/register', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Login user
 * @param {Object} data - { email, password }
 * @returns {Promise}
 */
export async function login(data) {
  try {
    const response = await axios.post('/api/auth/login', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Verify email with token
 * @param {string} token - Verification token from email
 * @returns {Promise}
 */
export async function verifyEmail(token) {
  try {
    const response = await axios.post('/api/auth/verify', { token })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise}
 */
export async function resendVerification(email) {
  try {
    const response = await axios.post('/api/auth/resend-verification', { email })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise}
 */
export async function refreshToken(refreshToken) {
  try {
    const response = await axios.post('/api/auth/refresh', { refreshToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Logout user
 * @param {string} refreshToken - Refresh token
 * @returns {Promise}
 */
export async function logout(refreshToken) {
  try {
    const response = await axios.post('/api/auth/logout', { refreshToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update password
 * @param {Object} data - { oldPassword, newPassword }
 * @returns {Promise}
 */
export async function updatePassword(data) {
  try {
    const response = await axios.put('/api/auth/password', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get current user data
 * @returns {Promise}
 */
export async function getMe() {
  try {
    const response = await axios.get('/api/auth/me')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Login or register with Google OAuth
 * @param {string} idToken - Google ID token
 * @returns {Promise}
 */
export async function googleAuth(idToken) {
  try {
    const response = await axios.post('/api/auth/google', { idToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
