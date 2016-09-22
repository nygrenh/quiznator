import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router';

class QuizTabs extends React.Component {
  render() {
    return (
      <Nav tabs>
        <NavItem>
          <Link to={`/dashboard/quizzes/${this.props.quizId}`} className="nav-link" activeClassName="active">
            Edit
          </Link>
        </NavItem>
      </Nav>
    )
  }
}

export default QuizTabs;
