import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBoards } from "../actions/boardAction";
import { logoutUser } from "../actions/authAction";
class BoardList extends React.Component {
  handleLogOut = () => {
    this.props.logoutUser();
  };
  componentDidMount() {
    this.props.fetchBoards();
  }

  renderAdmin(board) {
    if (board.owner === this.props.currentUser.id) {
      return (
        <div className="right floated content">
          <Link to={`/boards/edit/${board._id}`} className="ui button primary">
            Edit
          </Link>
          <Link
            to={`/boards/delete/${board._id}`}
            className="ui button negative"
          >
            Delete
          </Link>
        </div>
      );
    }
  }

  renderList() {
    if (this.props.boards.length === 0) {
      return (
        <div style={{ textAlign: "center" }}>
          <h2>You have no boards</h2>
        </div>
      );
    }
    return this.props.boards.map((board) => {
      return (
        <div className="item" key={board._id}>
          {this.renderAdmin(board)}
          <i className="large middle aligned icon" />
          <div className="content">
            <Link to={`/boards/${board._id}`} className="header">
              {board.name}
            </Link>
          </div>
        </div>
      );
    });
  }

  renderCreate() {
    if (this.props.isSignedIn) {
      return (
        <Link to="/boards/new" className="ui button primary">
          Create Board
        </Link>
      );
    }
  }
  //no hope

  render() {
    return (
      <div>
        <div
          className="right floated content"
          style={{
            display: "flex",
            justifyContent: "right",
          }}
        >
          {this.renderCreate()}
          <button className="ui button primary" onClick={this.handleLogOut}>
            Sign Out
          </button>
        </div>

        <h2>Board List</h2>
        <div className="ui celled list">{this.renderList()}</div>
        {/*this.renderCreate()*/}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    boards: state.boards.boardList,
    currentUser: state.auth.user,
    isSignedIn: state.auth.isAuthenticated,
  };
};
export default connect(mapStateToProps, { fetchBoards, logoutUser })(BoardList);
