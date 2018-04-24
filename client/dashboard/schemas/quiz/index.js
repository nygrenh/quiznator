import { Schema, arrayOf } from 'normalizr';

const quiz = new Schema('quizzes', { idAttribute: '_id' });
const item = new Schema('items');
const choice = new Schema('choices')

quiz.define({
  data: {
    items: arrayOf(item),
    choices: arrayOf(choice)
  }
});

export default quiz;
