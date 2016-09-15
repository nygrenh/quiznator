import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

class QuizPageTabs extends React.Component {
  render() {
    return (
      <Nav tabs>
        <NavItem>
          <NavLink className="active">
            Edit
          </NavLink>
        </NavItem>
      </Nav>
    )
  }
}

export default QuizPageTabs;
