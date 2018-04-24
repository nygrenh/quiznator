import React from 'react'
import lget from 'lodash.get'
import ReactMarkdown from 'react-markdown'
import withClassPrefix from 'utils/class-prefix';

import SubmitButton from 'components/quiz/submit-button';

class RadioMatrixQuiz extends React.Component {
    getItems() {
        return lget(this.props.quiz, 'data.items')
    }

    getChoices() {
        return lget(this.props.quiz, 'data.choices')
    }

    getChoiceForItem(itemId) {
        return lget(this.props.answer, ['data', itemId])
    }

    /*                     <div
    className={withClassPrefix('radio-matrix-quiz__choices-container')}
    key={choice.id}
    >
    */

    renderChoices(item) {
        const quizId = lget(this.props.quiz, '_id')

        return this.getChoices()
            .map((choice, index) => (
                <td key={`${quizId}-${item.id}-${choice.id}`}>
                    <input
                        type="radio"
                        name={`${quizId}-${item.id}`}
                        title={choice.title}
                        checked={this.getChoiceForItem(item.id) === choice.id}
                        onChange={() => this.props.onRadioMatrixChange(item.id, choice.id)}
                        disabled={!!this.props.disabled}
                    />
                </td>
            ))
    }
    
    renderSingleItem(item, index) {
        return (
            <tr
                className={withClassPrefix('radio-matrix-quiz__item clearfix')}
                key={item.id}
            >
                <td>
                    <div className={withClassPrefix('radio-matrix-quiz__item-title')}>
                        {item.title}
                    </div>
                </td>

                {this.renderChoices(item)}
            </tr>
        )
    }

    renderItems() {
        return this.getItems().map((item, index) => this.renderSingleItem(item, index))
    }

    renderLegend() {
        return (
            <tr>
                <th>&nbsp;</th>
                {this.getChoices().map(choice => (
                    <th key={choice.title}>{choice.title}</th>
                ))}
            </tr>
        )
    }

    onSubmit() {
        return e => {
            e.preventDefault()

            this.props.onSubmit()
        }
    }

    hasAnsweredEveryItem() {
        return Object.values(lget(this.props.answer, 'data') || {}).length === this.getItems().length
    }

    render() {
        const isValid = this.hasAnsweredEveryItem()
        const submitDisabled = !isValid || !!this.props.disabled || !!this.props.submitting
            
        return (
            <form onSubmit={this.onSubmit()} className={withClassPrefix('radio-matrix-quiz')}>
              <table>
                <thead>
                    {this.renderLegend()}
                </thead>
                <tbody>
                    {this.renderItems()}
                </tbody>
              </table>

              <div className={withClassPrefix('form-group')}>
                <SubmitButton disabled={submitDisabled} submitting={this.props.submitting} submitted={this.props.answerSubmitted}/>
              </div>
            </form>
          )
      
    }
}

export default RadioMatrixQuiz