import { axios } from '@/plugins/axios'

/**
 * Get all packages
 * @returns {Promise} Promise with packages data
 */
export async function getPackages() {
  try {
    const response = await axios.get('/packages')
    return response.data
  } catch (error) {
    console.error('Error fetching packages:', error)
    throw error
  }
}

/**
 * Get package by ID
 * @param {string} id - Package ID
 * @returns {Promise} Promise with package data
 */
export async function getPackageById(id) {
  try {
    const response = await axios.get(`/packages/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching package:', error)
    throw error
  }
}
