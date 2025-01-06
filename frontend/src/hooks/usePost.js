import { useMutation } from "react-query";
import { determineInstance } from "utils/helper";

const post = async ({
  url,
  payload,
  type,
  token = false,
  file = false,
  customHeaders = {},
}) => {
  const instance = determineInstance(type);

  const username = process.env.REACT_APP_Security_ID;
  const password = process.env.REACT_APP_Security_Password;
  const credentials = btoa(`${username}:${password}`);

  let headers = {
    "Content-Type": "text/plain",
    Authorization: `Basic ${credentials}`,
    Cookie: "pin_writes=y",
  };
  if (token) {
    // const accessToken = localStorage.getItem('token')
    // headers = { ...headers, "Authorization": `Basic ${credentials}` }
  }
  if (Object.keys(customHeaders).length > 0) {
    headers = { ...headers, ...customHeaders };
  }
  if (file) {
    headers = { ...headers, "Content-Type": "image/jpeg" };
  }
  const { data } = await instance
    .post(url, payload, {
      headers: headers,
      responseType: file ? "blob" : "json",
    })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      console.dir(e, { depth: null });
      throw e;
    });
  return data;
};

const usePost = () => useMutation(post);

export default usePost;
