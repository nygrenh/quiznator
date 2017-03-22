import React from 'react';

class Truncator extends React.Component {
  constructor() {
    super();

    this.state = {
      truncated: true,
    };
  }

  exceedsLength() {
    return this.props.content.length > this.props.length;
  }

  renderContent() {
    const { truncated } = this.state;

    if(this.exceedsLength() && truncated) {
      return `${this.props.content.substring(0, this.props.length)}...`;
    } else {
      return this.props.content;
    }
  }

  toggleTruncate() {
    const { truncated } = this.state;

    this.setState({
      truncated: !truncated,
    });
  }

  renderToggler() {
    const { truncated } = this.state;

    return (
      <button className="btn btn-secondary btn-sm" onClick={this.toggleTruncate.bind(this)}>
        {truncated ? 'Show more' : 'Show less'}
      </button>
    );
  }

  render() {
    return this.props.content ? (
      <span>
        {this.renderContent()} {' '}
        {this.exceedsLength() ? this.renderToggler() : null}
      </span>
    ) : null;
  }
}

export default Truncator;