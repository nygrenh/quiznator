import React from 'react';
import ReactPaginate from 'react-paginate';

class Paginator extends React.Component {
  onChange(status) {
     this.props.onChange(status.selected + 1);
  }

  getProperties() {
    return {
      pageNum: this.props.totalPages,
      forceSelected: this.props.activePage - 1,
      clickCallback: this.onChange.bind(this),
      pageRangeDisplayed: 5,
      marginPagesDisplayed: 2,
      containerClassName: 'pagination',
      pageClassName: 'page-item',
      pageLinkClassName: 'page-link',
      activeClassName: 'active',
      previousClassName: 'page-item',
      nextClassName: 'page-item',
      previousLinkClassName: 'page-link',
      nextLinkClassName: 'page-link',
      disabledClassName: 'disabled',
      breakClassName: 'page-item page-link page-break'
    }
  }

  render() {
    return (
      <nav className="paginator text-xs-center">
        <ReactPaginate {...this.getProperties()}/>
      </nav>
    )
  }
}

export default Paginator;
