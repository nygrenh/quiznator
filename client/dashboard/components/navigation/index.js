import React from 'react';
import { connect } from 'react-redux';
import { Button, Navbar, NavbarBrand, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router';

import { signOut } from 'state/tokens';

import Icon from 'components/icon';

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userMenuIsOpen: false
    }
  }

  toggleUserMenu() {
    const isOpen = this.state.userMenuIsOpen;

    this.setState({
      userMenuIsOpen: !isOpen
    });
  }

  renderUserMenu() {
    if(this.props.user && this.props.user.name) {
      return (
        <Dropdown isOpen={this.state.userMenuIsOpen} toggle={this.toggleUserMenu.bind(this)}>
          <DropdownToggle caret color="primary">
            <Icon name="user"/> {this.props.user.name}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={this.props.onSignOut}>Sign out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )
    } else {
      return null;
    }
  }

  renderLinks() {
    return (
      <NavItem>
        <Link to={'/dashboard/quizzes'} className={'nav-link'} activeClassName="active">
          Quizzes
        </Link>
      </NavItem>
    )
  }

  render() {
    return (
      <div>
         <Navbar color="faded" light>
          <div className="container">
             <Link to={'/dashboard'} className="navbar-brand">Quiznator</Link>

             <Nav navbar>
              {this.renderLinks()}
             </Nav>

             <Nav className="pull-xs-right" navbar>
               <NavItem>
                 {this.renderUserMenu()}
               </NavItem>
             </Nav>
            </div>
         </Navbar>
       </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  onSignOut: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
