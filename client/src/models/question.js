import axios from 'axios';
//increment view count by one
export async function view(question, appModel, setAppModel) {
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `http://localhost:8000/api/questions?question_id=${question._id}`,
    headers: { }
  };
  
  await axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
  setAppModel(undefined);
}

/**
 * @param {Model} model An instance of Model
 * @return {Array} Array of answer objects
 */
export function getAnswers(question, model) {
  return model.data.answers.filter((answer) => {
    return question.answers.find((ansId) => ansId === answer._id);
  });
}

/**
 * @param {Model} model An instance of Model
 * @return {Array} Array of tag objects
 */
//get all tag objects associated with this question in an array
export function getTags(question, model) {
  return model.data.tags.filter((tag) => {
    return question.tags.find((id) => tag._id === id);
  });
}

/**
   * Generates a string representing the metadata of a question.
   * @param {object} question - An object representing a question
   * @returns {string} - A string representing the metadata of the question
*/
export function getQuestionMetaData(question) {
  var currDate = new Date();
  var currDateArr = currDate.toString().split(" ");
  const questionDate = new Date(question.posted_time)
  var questionDateArr = questionDate.toString().split(" ");
  var metaDataString = "";
  //If question was posted on day X
  if (
    currDateArr[1] === questionDateArr[1] &&
    currDateArr[2] === questionDateArr[2] &&
    currDateArr[3] === questionDateArr[3]
  ) {
    if (currDate - questionDate < 60000) {
      //the question date should appear in seconds (if posted 0 mins. ago)
      var secondsAgo = Math.floor((currDate - questionDate) / 1000);
      metaDataString = <p><span style={{color: "green"}}>{question.asked_by}</span> asked {secondsAgo} seconds ago</p>;
    } else if (currDate - questionDate < 3600000) {
      //minutes (if posted 0 hours ago)
      var minutesAgo = Math.floor((currDate - questionDate) / 60000);
      metaDataString = <p><span style={{color: "green"}}>{question.asked_by}</span> asked {minutesAgo} minutes ago</p>;
    } else if (currDate - questionDate < 86400000) {
      //r hours (if posted less than 24 hrs ago).
      var hoursAgo = Math.floor((currDate - questionDate) / 3600000);
      metaDataString = <p><span style={{color: "green"}}>{question.asked_by}</span> asked {hoursAgo} hours ago</p>;
    }
  } else {
    //<username> questioned  <Month><day> at <hh:min>.
    var hourAndMinutes = questionDateArr[4].split(":").slice(0, 2).join(":");
    metaDataString = <p><span style={{color: "green"}}>{question.asked_by}</span> asked {questionDateArr[1]} {questionDateArr[2]} at {hourAndMinutes}</p>;
  }
  return metaDataString;
}