import React from 'react';
import { Link } from 'react-router';
import cssModules from 'react-css-modules';
import styles from '../styles/navbar.css';
import autobind from 'autobind-decorator';

import { getCurrentUser } from '../util/auth';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userAvatar: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      user: false,
    };
  }

  async componentWillMount() {
    const user = await getCurrentUser();
    if (user) {
      let userAvatar = this.state.userAvatar;

      if (user.github) userAvatar = user.github.avatar;
      else if (user.facebook) userAvatar = user.facebook.avatar;

      this.setState({ userAvatar, user: true });
    }
  }

  @autobind
  handleAuthClick() {
    if (!sessionStorage.getItem('redirectTo')) {
      sessionStorage.setItem('redirectTo', this.props.location.pathname);
    }
  }

  render() {
    return (
      <nav className="grey darken-3">
        <div className="container">
          <Link to="/" className="brand-logo">Lets Meet</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {this.state.user ?
              <li>
                <Link to="/dashboard">Dashboard</Link>
                <a href="/api/auth/logout">Logout</a>
                <a href="#">
                  <img
                    alt="avatar"
                    styleName="nav-img"
                    src={this.state.userAvatar}
                  />
                </a>
              </li> :
              <li>
                <Link to="/login" onClick={this.handleAuthClick}>Login</Link>
                <Link to="/signup" onClick={this.handleAuthClick}>Signup</Link>
              </li>
            }
          </ul>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  location: React.PropTypes.object,
};

export default cssModules(Navbar, styles);
