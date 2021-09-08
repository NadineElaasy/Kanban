// import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { GET_ERRORS, SET_CURRENT_USER, IS_SIGNEDUP } from "./types";
import jwt_decode from "jwt-decode";
import routes from "../apis/routes";
import history from "../history";
import swal from 'sweetalert';
export const registerUser = (userData) => (dispatch) => {
  // console.log(userData)
  let state = false;
  routes
    .post("/users/register", userData)
    .then((res) => {
      swal({
        title: "Good job!",
        text: "You've successfully registerd, Now Log In!",
        icon: "success",
      });
      dispatch({ type: IS_SIGNEDUP, payload: true });
      state = true;
      history.push("/");
      return state;
     
    })
    .catch((err) => {
      swal({
        title: "Oops!",
        text: err.response.data.msg,
        icon: "error",
      });
     
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};

export const loginUser = (userData) => (dispatch) => {
//  console.log(userData);

  routes
    .post("/users/login", userData)
    .then((res) => {
      const { token, data } = res.data;
      console.log(res.data);
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      localStorage.setItem("payload", decoded.id);
      dispatch(setCurrentUser(data));
      history.push("/boards");
    })
    .catch((err) => {
      // console.log(err)
      swal({
        title: "Oops!",
        text: err.response.data.msg,
        icon: "error",
      });
      dispatch({
        type: GET_ERRORS,
        payload: err,
      });
    });
};

//Log user in
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

//Log user out
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("state");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  history.push("/");
};
