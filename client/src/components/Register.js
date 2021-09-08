import React from "react";
import { connect } from "react-redux";
import { registerUser } from "../actions/authAction";
import { Link } from "react-router-dom";
import LogoHeader from "./LogoHeader";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      password2: "",
    };
  }
  componentDidMount() {
    console.log("Register");
  }
  onSubmitRegister = (e) => {
    e.preventDefault();
    if (this.state.password !== this.state.password2)
      alert("Password are not the same, Re-try!");
    else {
      const userData = {
        name: this.state.userName,
        password: this.state.password,
      };

      this.props.registerUser(userData);
    }
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
        <div>
          <LogoHeader/>
        <div class="ui center aligned container" style={{
            border:"1px solid #A861D5",
            borderRadius:"5px",
            padding:"10px"
        }}>
      <form className="ui form" onSubmit={this.onSubmitRegister}>
        <div className="field">
          <input
            type="text"
            label="username"
            name="userName"
            placeholder="Enter Your Username"
            onChange={this.handleChange}
            value={this.state.userName}
          />
        </div>
        <div className="required field">
          <input
            type="password"
            label="password"
            name="password"
            placeholder="Enter a password"
            onChange={this.handleChange}
            value={this.state.password}
          />
        </div>
        <div className="field">
          <input
            type="password"
            label="password2"
            placeholder="Confirm the password"
            name="password2"
            onChange={this.handleChange}
            value={this.state.password2}
          />
        </div>
        <br />
        <button className="ui submit button purple">Sign Up!</button>
        <Link to={"/"} className="ui button">
          Login
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

export default connect(mapStateToProps, { registerUser })(Register);
