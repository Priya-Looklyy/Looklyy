// API Configuration for Lookly Frontend
// Environment variable for backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://looklyy.onrender.com'

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: `${API_BASE_URL}/api/auth/login`,
      register: `${API_BASE_URL}/api/auth/register`,
    },
    users: {
      me: `${API_BASE_URL}/api/users/me`,
      profile: `${API_BASE_URL}/api/users/profile`,
    },
    brands: `${API_BASE_URL}/api/brands`,
    products: `${API_BASE_URL}/api/products`,
    lookboards: `${API_BASE_URL}/api/lookboards`,
  }
}

export const fetchAPI = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}
