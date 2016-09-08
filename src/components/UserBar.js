import React, { Component, PropTypes } from 'react';
import '../styles/userbar.scss';

class UserBar extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;

    return (
      <div className="userbar-cont" id="userbar">
        <div className="user">
          <div className="username">
            <a href="https://jotform.com/myaccount/" target="_blank" title="My Account">
              <span className="text">{user.details.username} <i className="fa fa-user"></i></span>
            </a>
          </div>
          <div className="avatar">
            <img src={user.details.avatarUrl} alt={user.details.avatarUrl} />
          </div>
        </div>
      </div>
    );
  }
}

export default UserBar;
