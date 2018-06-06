import React from 'react'
import { connect } from 'react-redux'
import ReactChartkick, { ColumnChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'
//import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries } from 'react-vis'
import Loader from 'components/loader'
import { fetchQuizAnswerDistribution } from 'state/quiz-answer-distribution';

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

        graphData.push([points[idx] * 100 + '%', data.filter(answer => filter(answer.completion.data.answerValidation[0].normalizedPoints)).length])
      }

      this.setState({
        initializing: false,
        graphData
      })
    })
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
          <span>Total {this.props.quizAnswerDistribution.answers.length} answers          <br />
          </span>
          <table>
            <tbody>
              {this.state.graphData.map((point) => {
                return (
                  <tr key={`key-${point[0]}`}>
                  <td width="20%"><span>{point[0]}</span></td>
                  <td width="50%"><span>{point[1]}</span></td>
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
