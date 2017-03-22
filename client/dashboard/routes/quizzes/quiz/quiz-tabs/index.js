import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router';

class QuizTabs extends React.Component {
  render() {
    return (
      <Nav tabs>
        <NavItem>
          <Link to={`/dashboard/quizzes/${this.props.quizId}/edit`} className="nav-link" activeClassName="active">
            Edit
          </Link>
        </NavItem>

        <NavItem>
          <Link to={`/dashboard/quizzes/${this.props.quizId}/settings`} className="nav-link" activeClassName="active">
            Settings
          </Link>
        </NavItem>

        <NavItem>
          <Link to={`/dashboard/quizzes/${this.props.quizId}/answers`} className="nav-link" activeClassName="active">
            Answers
          </Link>
        </NavItem>
      </Nav>
    )
  }
}

export default QuizTabs;
