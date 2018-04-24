import React from 'react'
import { Button, FormGroup, Label, Input } from 'reactstrap'
import Select from 'react-select'
import _get from 'lodash/get'

import ItemEditor from 'components/quiz-editor/item-editor'
import MetaEditor from 'components/quiz-editor/meta-editor'
import RadioMatrixQuizEditorMetaEditor from './radio-matrix-quiz-editor-meta-editor';

class RadioMatrixQuizEditor extends React.Component {
    onDataChoiceChange(id, value) {
        this.props.onDataChoiceChange(id, { title: value })
    }

    onAddDataChoice() {
        this.props.onAddDataChoice({ title: '' })
    }

    onRemoveDataChoice(id) {
        this.props.onRemoveDataChoice(id)
    }

    onDataItemChange(id, value) {
        this.props.onDataItemChange(id, { title: value });
    }

    onAddDataItem() {
        this.props.onAddDataItem({ title: '' });
    }

    onRemoveDataItem(id) {
        this.props.onRemoveDataItem(id);
    }
    
    onRightAnswersChange(value) {
        console.log('rightchange', value)
        this.props.onDataMetaChange({ rightAnswer: value });
    }

/*     onRightAnswersChange(value) {
        console.log(value)
        Object.keys(value).map(itemId =>
            this.props.onDataMetaPathChange(['rightAnswer', itemId], value[itemId]));
    }
 */
    onSuccessMessageChange(id, value) {
        this.props.onDataMetaPathChange(['successes', id], value);
    }

        onErrorMessageChange(id, value) {
        this.props.onDataMetaPathChange(['errors', id], value);
    }
    
    render() {
        return (
            <div>
                <FormGroup>
                    <Label>Choices</Label>
                    {//separate component...
                    }
                    <ItemEditor
                        items={this.props.choices}
                        type={this.props.quiz.type}
                        onAddDataItem={this.onAddDataChoice.bind(this)}
                        onDataItemOrderChange={this.props.onDataChoiceOrderChange}
                        onDataItemChange={this.onDataChoiceChange.bind(this)} 
                        onRemoveDataItem={this.onRemoveDataChoice.bind(this)}
                    />

                </FormGroup>

                <div className="m-b-1">
                    <label>Items</label>
        
                    <ItemEditor items={this.props.items} onAddDataItem={this.onAddDataItem.bind(this)} onDataItemOrderChange={this.props.onDataItemOrderChange} onDataItemChange={this.onDataItemChange.bind(this)} onRemoveDataItem={this.onRemoveDataItem.bind(this)}/>
                </div>


                <MetaEditor>
                    <RadioMatrixQuizEditorMetaEditor 
                        meta={_get(this.props.quiz, 'data.meta')} 
                        items={this.props.items} 
                        choices={this.props.choices}
                        rightAnswer={_get(this.props.quiz, 'data.meta.rightAnswer') || {}} 
                        onRightAnswersChange={this.onRightAnswersChange.bind(this)} 
                        onSuccessMessageChange={this.onSuccessMessageChange.bind(this)} 
                        onErrorMessageChange={this.onErrorMessageChange.bind(this)}/>
                </MetaEditor>
            
            </div>
        )
    }
}

RadioMatrixQuizEditor.defaultProps = {
    items: [],
    choices: []
}

export default RadioMatrixQuizEditor;
