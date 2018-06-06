import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { FormGroup } from 'reactstrap'
import { Input, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { updateConfirmation, updateRejection } from 'state/quiz-answers'
import { fetchQuizReviewAnswers, updateReviewConfirmation, updateReviewRejection } from 'state/quiz-review-answers'
import { selectQuizReviewAnswers } from 'selectors/quiz-review-answers'
import Loader from 'components/loader'
import Truncator from 'components/truncator'
import ReactTable from 'react-table'
import "react-table/react-table.css"

class QuizReviewAnswers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: ["review"],
      dropdownOptions: ["review", "rejected", "pass"],
      isDropdownOpen: false,
      dataLoading: true
    }
  }

  componentDidMount() {
    this.setState({ dataLoading: true })
    this.props.onFetchQuizReviewAnswers(this.props.params.id, this.state.options)
      .then(_ => this.setState({ dataLoading: false }))
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)

    if (nextProps.location.query !== this.props.location.query) {
      this.props.onFetchQuizReviewAnswers(this.props.params.id, this.state.options)
        .then(_ => this.setState({ dataLoading: false }))
    }
  }

  /*        <p className="text-muted">
          Spam flags: {answer.spamFlags} · Peer reviews given: {answer.givenPeerReviewsCount}
        </p>

        <h5>Peer reviews received</h5>

        {answer.receivedPeerReviews.map(peerReview => {
          return (
            <div className="card" key={peerReview._id}>
              <div className="card-block">
                <Truncator content={peerReview.review} length={100} />
              </div>
            </div>
          );
        })}

  */

  updateConfirmation({ answerId, confirmed }) {
    this.props.onUpdateConfirmation({ answerId, confirmed })
    this.props.onUpdateReviewConfirmation({ answerId, confirmed })
  }

  updateRejection({ answerId, rejected }) {
    this.props.onUpdateRejection({ answerId, rejected })
    this.props.onUpdateReviewRejection({ answerId, rejected })
  }

  renderStatus(status) {
    return (
      <div key={status._id}>
        {/*this.renderConfirmationButton(answer)*/
        }
        <h4>{status.answererId}</h4>
        <h5>Latest answer</h5>
        <p>
          <Truncator content={status.data.answer.data} length={200} />
        </p>

        <p className="text-muted">
          Spam flags: {status.spamFlags} · Peer reviews given: {status.data.peerReviewsGiven.length}
        </p>
        <h5>Peer reviews received</h5>

        <p className="text-muted">
          Peer reviews received: {status.data.peerReviewsReceived.length} · Sad face percentage: {Math.round(status.data.sadFacePercentage)} · Average grade: {Math.round(status.data.averageGrade)}  
        </p>
      </div>
    )
  }

  renderAnswers() {
    return (
      <div>
        {this.props.reviewAnswers.statuses.map(status => this.renderStatus(status))}
      </div>
    );
  }

  color(cond1, cond2) {
    return cond1 ? '#000000' 
    : (cond2
      ? '#800000' :
        '#FF0000')
  }

  toggleMenu() {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen })
  }

  dropdownSelect(e) {
    const options = [e.target.value]
    this.setState({ options, dataLoading: true, isDropdownOpen: false })
    console.log(options)
    this.props.onFetchQuizReviewAnswers(this.props.params.id, options)
      .then(_ => this.setState({ dataLoading: false }))
  }

  renderDropdown() {
    return (
      <Dropdown
        isOpen={this.state.isDropdownOpen}
        toggle={this.toggleMenu.bind(this)}
      >
      <DropdownToggle caret color="success">
        options
      </DropdownToggle>
      <DropdownMenu>
      {this.state.dropdownOptions.map(option => (
        <DropdownItem key={`item-${option}`}>
          <Input
            type="radio"
            id={option}
            key={option}
            value={option}
            checked={!!~this.state.options.indexOf(option)}
            onChange={this.dropdownSelect.bind(this)}
          />
          <Label for={option}>{option}</Label>
        </DropdownItem>
      ))}
      </DropdownMenu>
      </Dropdown>
    )
  }

  render() {
    if (this.props.reviewAnswers.loading || this.state.dataLoading) {
      return <div><Loader /></div>
    }
    const data = this.props.reviewAnswers.statuses

    return (
      <div>
        {this.renderDropdown()}
        <ReactTable
          data={data}
          columns={[
            { Header: 'Info',
              width: 600,
              columns: [
              {
                Header: 'Answerer',
                accessor: 'answererId',
                maxWidth: 100
              },
              {
                Header: 'Answer',
                id: 'data',
                accessor: s => s.answer.data,
                Cell: row => <div style={{ width: '100%' }}><Truncator content={row.value} length={200} /></div>,
                width: 500,
              }]
            },
            {
              Header: 'Statistics',
              width: 100,
              columns: [
                {                
                  Header: 'Spam',
                  id: 'spamFlags',
                  accessor: s => s.data.spamFlags, 
                  width: 50,
                  getProps: (state, rowInfo, column) => ({
                    style: {
                      textAlign: 'right',
                      color: this.color(
                        !!rowInfo && rowInfo.row.spamFlags < 1,
                        !!rowInfo && rowInfo.row.spamFlags <= 3)
                      }
                    })
                },
                {
                  Header: 'Given',
                  id: 'prg',
                  accessor: s => s.data.peerReviewsGiven, 
                  width: 50,
                  getProps: (state, rowInfo, column) => ({
                    style: {
                      textAlign: 'right',
                      color: this.color(
                        !!rowInfo && rowInfo.row.prg >= 3,
                        !!rowInfo && rowInfo.row.prg < 3)
                      }
                    })
                },
                {
                  Header: 'Rcvd',
                  id: 'prr',
                  accessor: s => s.data.peerReviewsReceived, 
                  width: 50,
                  getProps: (state, rowInfo, column) => ({
                    style: {
                      textAlign: 'right',
                      color: this.color(
                        !!rowInfo && rowInfo.row.prr >= 3,
                        !!rowInfo && rowInfo.row.prr < 3)
                      }
                    })
                },
                {
                  Header: 'Sad%',
                  id: 'sad',
                  accessor: s => Math.round(s.data.sadFacePercentage), 
                  width: 50,
                  getProps: (state, rowInfo, column) => ({
                    style: {
                      textAlign: 'right',
                      color: this.color(
                        !!rowInfo && rowInfo.row.sad < 35,
                        !!rowInfo && rowInfo.row.prg >= 35)
                      }
                    })
                },
                {
                  Header: 'Grade',
                  id: 'grade',
                  accessor: s => Math.round(s.data.gradePercentage), 
                  width: 50,
                }
              ]
            },
            { 
              Header: 'Status',
              width: 200,
              id: 'status',
              accessor: s => s.answer,
              Cell: row => {
                const confirmed = row.value.confirmed
                const rejected = row.value.rejected

                return (
                  <div>
                    {!rejected && 
                      <button 
                        className={`btn ${confirmed ? 'btn-danger' : 'btn-primary'} btn-sm pull-xs-right`}
                        onClick={() => this.updateConfirmation({ answerId: row.value._id, confirmed: !confirmed })}
                        >
                      {confirmed ? 'Remove confirmation' : 'Confirm'}
                    </button>}
                    {!confirmed && 
                      <button 
                        className={`btn ${rejected ? 'btn-primary' : 'btn-danger'} btn-sm pull-xs-right`}
                        onClick={() => this.updateRejection({ answerId: row.value._id, rejected: !rejected })}
                      >
                        {rejected ? 'Remove rejection' : 'Reject'}
                    </button>}
                  </div>
                )
              },
            }
        ]}
          resolveData={data => data.map(row => row)}
          className="-striped -highlight"
        />
      </div>
    )
  }
}
/*
*/
const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchQuizReviewAnswers: (quizId, options) => dispatch(fetchQuizReviewAnswers(quizId, options)),
  onUpdateConfirmation: ({ answerId, confirmed }) => dispatch(updateConfirmation({ answerId, confirmed })),
  onUpdateRejection: ({ answerId, rejected }) => dispatch(updateRejection({ answerId, rejected })),
  onUpdateReviewConfirmation: ({ answerId, confirmed }) => dispatch(updateReviewConfirmation({ answerId, confirmed })),
  onUpdateReviewRejection: ({ answerId, rejected }) => dispatch(updateReviewRejection({ answerId, rejected })),
})

const mapStateToProps = state => ({
  reviewAnswers: selectQuizReviewAnswers(state)  
})

export default connect(mapStateToProps, mapDispatchToProps)(QuizReviewAnswers)
