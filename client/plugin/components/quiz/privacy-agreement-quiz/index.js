import React from 'react';
import lget from 'lodash.get';
import ReactMarkdown from 'react-markdown';

import withClassPrefix from 'utils/class-prefix';

import SubmitButton from 'components/quiz/submit-button';

class PrivacyAgreementQuiz extends React.Component {
    componentDidMount() {
    }

    getAnswer() {
        return lget(this.props.answer, 'data') || [];
    }
    
    answerIncludes(id) {
        return this.getAnswer().indexOf(id) >= 0;
    }
    
    onPrivacyAgreementChange(e) {
        if(e.target.checked) {
            return this.props.onPrivacyAgreementChange([...this.getAnswer(), e.target.value]);
        } else {
            return this.props.onPrivacyAgreementChange([...this.getAnswer().filter(id => id !== e.target.value)]);
        }
    }
    
    renderCheckbox(item) {
        return (
            <div key={item.id} className={withClassPrefix('privacy-agreement')}>
            <label>
                <input type="checkbox" checked={this.answerIncludes(item.id)} disabled={this.props.disabled} name={`${this.props.quiz._id}-multiple-choise`} value={item.id} onChange={this.onPrivacyAgreementChange.bind(this)}/>
                <ReactMarkdown source={item.title} />
            </label>
            </div>
        );
    }
    
    renderCheckboxes() {
        return this.props.quiz.data.items.map(item => this.renderCheckbox(item));
    }

    onSubmit() {
        return e => {
            e.preventDefault();

            this.props.onSubmit();
        }
    }

    render() {
        const submitDisabled = !!this.props.disabled || !!this.props.submitting;

        return (
            <form onSubmit={this.onSubmit()}>
            <div className={withClassPrefix('form-group')}>
                {this.renderCheckboxes()}
            </div>

            <div className={withClassPrefix('form-group')}>
                <SubmitButton disabled={submitDisabled} submitting={this.props.submitting} submitted={this.props.answerSubmitted}/>
            </div>
            </form>
        )
    }
}

export default PrivacyAgreementQuiz;
