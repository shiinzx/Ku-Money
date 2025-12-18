import { axios } from '@/plugins/axios'

/**
 * Get all categories
 * @param {string} type - Optional: 'incomes' | 'expenses'
 * @returns {Promise}
 */
export async function getCategories(type = null) {
  try {
    const url = type ? `/categories?type=${type}` : '/categories'
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise}
 */
export async function getCategoryById(id) {
  try {
    const response = await axios.get(`/categories/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new category
 * @param {Object} data - { title, icon, type }
 * @returns {Promise}
 */
export async function createCategory(data) {
  try {
    const response = await axios.post('/categories', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update category
 * @param {string} id - Category ID
 * @param {Object} data - { title?, icon? }
 * @returns {Promise}
 */
export async function updateCategory(id, data) {
  try {
    const response = await axios.put(`/categories/${id}`, data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete category
 * @param {string} id - Category ID
 * @returns {Promise}
 */
export async function deleteCategory(id) {
  try {
    const response = await axios.delete(`/categories/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

