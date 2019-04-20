import axios from "axios";
import {
  FETCH_USER
} from "./types";

axios.create({
  baseURL: "http://localhost:5000"
})

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({
    type: FETCH_USER,
    payload: res
  });
};