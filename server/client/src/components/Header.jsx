import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

class Header extends React.Component {
  renderContent() {
    const data = this.props.auth === null ? null : this.props.auth.data.length;
    switch (data) {
      case null:
        return (
          <li>
            <a href="/account/login">loading</a>
          </li>
        );
      case 0:
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        );
      default:
        return (
          <li>
            <a href="/api/logout">logout</a>
          </li>
        );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <Link
            to={
              this.props.auth !== null && this.props.auth.data.length !== 0
                ? '/surveys'
                : '/'
            }
            className="left brand-logo"
          >
            Emaily
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({auth}) => {
  return {auth};
};

export default connect(mapStateToProps)(Header);
