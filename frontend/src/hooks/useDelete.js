import { useMutation } from "react-query";
import { determineInstance } from "utils/helper";

const deleteRequest = async ({ url, type, token = false, }) => {
  const instance = determineInstance(type);
  let headers = {};
  if (token) {
    const accessToken = localStorage.getItem('token')
    headers = { 'JCMS-API-TOKEN': accessToken }
  }
  const { data } = await instance.delete(url, { headers })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.dir(e, { depth: null });
      throw e;
    });
  return data;
};

const useDelete = () => useMutation(deleteRequest);

export default useDelete;
