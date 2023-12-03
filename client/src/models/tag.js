/**
 * @param {Model} appModel An instance of Model
 * @return {Array} Array of question objects
 */
//returns all question objects associated with this tag in an array
export function getQuestions(appModel, tag) {

  return appModel.data.questions.filter((question) => {
    return question.tags.indexOf(tag._id) > -1;
  });
}
