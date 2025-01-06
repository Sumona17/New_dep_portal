import { useMutation } from "react-query";
import { determineInstance } from "utils/helper";

const put = async ({ url, payload, type, token = false, file = false }) => {
  const instance = determineInstance(type);
  let headers = {
    "Content-Type": "application/json",
    "Cookie": "pin_writes=y"
  };
  if (token) {
    const accessToken = localStorage.getItem('token')
    headers = { 'JCMS-API-TOKEN': accessToken, }
  }
  if (file) {
    headers = { ...headers, Accept: '', "Content-Type": "image/jpeg" };
  }
  const { data } = await instance.put(url, payload, { headers, responseType: file ? 'blob' : 'json' })
    .then((res) => {
      return res;
    })
    .catch(async (e) => {
      console.dir(e, { depth: null });
      throw e;
    });
  return data;
};

const usePut = () => useMutation(put);

export default usePut;
