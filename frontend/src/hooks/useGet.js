import { useMutation } from 'react-query'
import { determineInstance } from 'utils/helper'

const get = async ({ url, type, token = false, file = false }) => {
  const instance = determineInstance(type)
  let headers = {}
  if (token) {
    const accessToken = localStorage.getItem('token')
    headers = { 'JCMS-API-TOKEN': accessToken, "Content-Type": "image/jpeg" }
  }
  if (file) {
    headers = { ...headers, "Content-Type": "image/jpeg" };
  }
  const { data } = await instance
    .get(url, { headers, responseType: file ? 'blob' : 'json' })
    .then((res) => {
      return res
    })
    .catch(async (e) => {
      console.dir(e, { depth: null })
      throw e
    })
  return data
}

const useGet = () => useMutation(get)

export default useGet
