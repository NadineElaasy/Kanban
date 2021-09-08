import React from "react";
import { connect } from "react-redux";
import { loginUser } from "../actions/authAction";
import { Link } from "react-router-dom";
import LogoHeader from "./LogoHeader";
//import history from "../history";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
    };
  }
  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  onSubmitLogin = (e) => {
    e.preventDefault();
    const userData = {
      name: this.state.userName,
      password: this.state.password,
    };
    this.props.loginUser(userData);
  };

  render() {
    return (
      <div>
      <LogoHeader/>
      <div class="ui center aligned container" style={{
        border:"1px solid #A861D5",
        borderRadius:"5px",
        padding:"5px"
    }}>
        <form className="ui form" onSubmit={this.onSubmitLogin}>
          <div className="field">
            {" "}
            <input
              type="text"
              label="username"
              name="userName"
              placeholder="Username"
              onChange={this.handleChange}
              value={this.state.userName}
            />
          </div>

          <div className="field">
            <input
              type="password"
              label="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </div>
            <br/>
          <button className="ui submit button purple">Login</button>
          <Link to={"/register"} className="ui button ">
            Sign Up
          </Link>
          
        </form>
       
      </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
//export default Login;
