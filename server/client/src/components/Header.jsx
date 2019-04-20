import React from 'react';
import {connect} from 'react-redux';

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
            <a href="/account/login">login</a>
          </li>
        );
      default:
        return (
          <li>
            <a href="/account/login">logout</a>
          </li>
        );
    }
  }

  render() {
    return (
      <nav>
        <div className="nav-wrapper">
          <a className="left brand-logo" href="#">
            Emaily
          </a>
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
