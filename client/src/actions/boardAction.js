import { GET_ERRORS, FETCH_BOARDS } from "./types";
import jwt_decode from "jwt-decode";
import routes from "../apis/routes";

export const fetchBoards = () => (dispatch) => {
  // let state = false;
//console.log("Token value ", localStorage.getItem("jwtToken"))
  routes
    .get("/boards/user/allboards",{
        headers: {
          'Authorization': localStorage.getItem("jwtToken")
        }
      })
    .then((res) => {
      //alert("Done");
      //console.log("res.data :", res.data.data )
      dispatch({ type: FETCH_BOARDS, payload: res.data.data });
      // state = true;
      //return state;
    })
    .catch((err) => {
      alert(err.response);
      dispatch({ type: GET_ERRORS, payload: err.response });
    });
};
