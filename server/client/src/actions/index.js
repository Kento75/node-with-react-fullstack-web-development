import axios from "axios"
import {
  FETCH_USER
} from "./types"

axios.defaults.proxy.host = "http://localhost"
axios.defaults.proxy.port = "5000"

const fetchUser = () => {
  return function (dispatch) {
    axios.get("/api/current_user")
      .then(res => dispatch({
        type: FETCH_USER,
        payload: res
      }))
  }
}