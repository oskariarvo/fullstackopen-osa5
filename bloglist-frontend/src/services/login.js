import axios from "axios"
const baseURL = "api/login"

const login = async credentials => {
  const res = await axios.post(baseURL, credentials)
  console.log(res.data)
  return res.data
}

export default { login }