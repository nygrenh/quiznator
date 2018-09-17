import React from 'react'
import { connect } from 'react-redux'
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'
//import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries } from 'react-vis'
import Loader from 'components/loader'
import { fetchQuizAnswerDistribution } from 'state/quiz-answer-distribution';
import { ESSAY } from 'common-constants/quiz-types'

ReactChartkick.addAdapter(Chart)

class QuizAnswerDistribution extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initializing: true,
      graphData: {},
    }
  }

  componentDidMount() {
    this.props.onFetchDistribution(this.props.params.id, null)
      .then(_ => {
      const data = this.props.quizAnswerDistribution.answers
      const points = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
      const graphData = []

      var idx

      for (idx = 0; idx < points.length; idx++) {
        let filter = (point) => {}
        if (idx < points.length - 1) {
          filter = point => (point >= points[idx] && point < points[idx + 1])
        } else {
          filter = point => (point >= points[idx])  
        }

        const amount = data.filter(answer => filter(answer.completion.data.answerValidation[0].normalizedPoints)).length

        graphData.push([points[idx] * 100 + '%', amount])
      }

      this.setState({
        initializing: false,
        graphData
      })
    })
  }

  renderEssayStats() {
    const data = this.props.quizAnswerDistribution.answers

    if (data.length === 0) {
      return null
    }

    if (data[0].completion.data.answerValidation[0].type !== ESSAY) {
      return null
    }
    
    const confirmed = data.filter(answer => answer.completion.data.answerValidation[0].confirmed).length
    const rejected = data.filter(answer => answer.completion.data.answerValidation[0].rejected).length
    // TODO: do we need to know of deprecated?
  
    return (
      <div>
        <span>{confirmed} confirmed, {rejected} rejected, {data.length - confirmed - rejected} awaiting</span>
      </div>
    )
  }

  render() {
    if (this.state.initializing) {
      return <div><Loader /></div>
    }

    return (
      <div>
          <ColumnChart 
            data={this.state.graphData}
          />
          <PieChart
            data={this.state.graphData}
          />
        <div>
          <span>Total {this.props.quizAnswerDistribution.answers.length} answers<br /></span>
          {this.renderEssayStats()}
          <table>
            <thead>
            <tr>
              <th>points</th>
              <th>amount</th>
              <th>%</th>
            </tr>
            </thead>
            <tbody>
              {this.state.graphData.map((point) => {
                return (
                  <tr key={`key-${point[0]}`}>
                  <td width="30%"><span>{point[0]}</span></td>
                  <td width="50%"><span>{point[1]}</span></td>
                  <td width="30%"><span>{this.props.quizAnswerDistribution.answers.length > 0 ? Math.round(point[1] / this.props.quizAnswerDistribution.answers.length * 100) : 0}%</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchDistribution: (quizId, options) => dispatch(fetchQuizAnswerDistribution(quizId, options))
})

const mapStateToProps = state => ({
  quizAnswerDistribution: state.quizAnswerDistribution
})

export default connect(mapStateToProps, mapDispatchToProps)(QuizAnswerDistribution)
