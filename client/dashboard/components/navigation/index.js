import React from 'react';
import { connect } from 'react-redux';
import { Button, Navbar, NavbarBrand, Nav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
          <DropdownToggle caret>
            {this.props.user.name}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Sign out</DropdownItem>
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
        <NavLink href="/">Quizzes</NavLink>
      </NavItem>
    )
  }

  render() {
    return (
      <div>
         <Navbar color="faded" light>
          <div className="container">
             <NavbarBrand href="/">Quiznator</NavbarBrand>

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

export default connect(
  mapStateToProps
)(Navigation);
