import React from "react";
import Logo from "../imgs/Logo.JPG";

class LogoHeader extends React.Component {
  render() {
    return (
      <div>
        <img src={Logo} alt="Logo" className="ui centered image" />
      </div>
    );
  }
}
export default LogoHeader;
