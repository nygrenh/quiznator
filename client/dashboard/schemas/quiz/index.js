import { Schema, arrayOf } from 'normalizr';

const quiz = new Schema('quizzes', { idAttribute: '_id' });
const item = new Schema('items');

quiz.define({
  data: {
    items: arrayOf(item),
  }
});

export default quiz;
