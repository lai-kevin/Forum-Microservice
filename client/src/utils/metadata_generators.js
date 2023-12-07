/**
 * Returns a string representing the metadata of an answer.
 *
 *
 * @param {object} answer - An object containing the answer details.
 * @returns {string} - A string representing the metadata of the answer.
 */
function getAnswerMetaData(answer) {
  var currDate = new Date();
  var currDateArr = currDate.toString().split(" ");
  const answerDate = new Date(answer.ans_date_time);
  var answerDateArr = answerDate.toString().split(" ");
  var metaDataString = "";
  //If answer was posted on day X
  if (
    currDateArr[1] === answerDateArr[1] &&
    currDateArr[2] === answerDateArr[2] &&
    currDateArr[3] === answerDateArr[3]
  ) {
    if (currDate - answerDate < 60000) {
      //the answer date should appear in seconds (if posted 0 mins. ago)
      var secondsAgo = Math.floor((currDate - answerDate) / 1000);
      metaDataString = (
        <p>
          <span style={{ color: "green" }}>{answer.ans_by}</span> answered{" "}
          {secondsAgo} seconds ago
        </p>
      );
    } else if (currDate - answerDate < 3600000) {
      //minutes (if posted 0 hours ago)
      var minutesAgo = Math.floor((currDate - answerDate) / 60000);
      metaDataString = (
        <p>
          <span style={{ color: "green" }}>{answer.ans_by}</span> answered{" "}
          {minutesAgo} minutes ago
        </p>
      );
    } else if (currDate - answerDate < 86400000) {
      //r hours (if posted less than 24 hrs ago).
      var hoursAgo = Math.floor((currDate - answerDate) / 3600000);
      metaDataString = (
        <p>
          <span style={{ color: "green" }}>{answer.ans_by}</span> answered{" "}
          {hoursAgo} hours ago
        </p>
      );
    }
  } else {
    //<username> answered  <Month><day> at <hh:min>.
    var hourAndMinutes = answerDateArr[4].split(":").slice(0, 2).join(":");
    metaDataString = (
      <p>
        <span style={{ color: "green" }}>{answer.ans_by}</span> answered{" "}
        {answerDateArr[1]} {answerDateArr[2]} at {hourAndMinutes}
      </p>
    );
  }
  return metaDataString;
}

/**
 * Generates a string representing the metadata of a question.
 * @param {object} question - An object representing a question
 * @returns {string} - A string representing the metadata of the question
 */
function QuestionMetaData({ question }) {
  var currDate = new Date();
  var currDateArr = currDate.toString().split(" ");
  const questionDate = new Date(question.posted_time);
  var questionDateArr = questionDate.toString().split(" ");
  //If question was posted on day X
  if (
    currDateArr[1] === questionDateArr[1] &&
    currDateArr[2] === questionDateArr[2] &&
    currDateArr[3] === questionDateArr[3]
  ) {
    if (currDate - questionDate < 60000) {
      //the question date should appear in seconds (if posted 0 mins. ago)
      var secondsAgo = Math.floor((currDate - questionDate) / 1000);
      return (
        <div>
          <p>
            <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
            {secondsAgo} seconds ago
          </p>
        </div>
      );
    } else if (currDate - questionDate < 3600000) {
      //minutes (if posted 0 hours ago)
      var minutesAgo = Math.floor((currDate - questionDate) / 60000);
      return (
        <div>
          <p>
            <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
            {minutesAgo} minutes ago
          </p>
        </div>
      );
    } else if (currDate - questionDate < 86400000) {
      //r hours (if posted less than 24 hrs ago).
      var hoursAgo = Math.floor((currDate - questionDate) / 3600000);
      return (
        <div>
          <p>
            <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
            {hoursAgo} hours ago
          </p>
        </div>
      );
    }
  } else {
    //<username> questioned  <Month><day> at <hh:min>.
    var hourAndMinutes = questionDateArr[4].split(":").slice(0, 2).join(":");
    return (
      <div>
        <p>
          <span style={{ color: "green" }}>{question.asked_by.username}</span> asked{" "}
          {questionDateArr[1]} {questionDateArr[2]} at {hourAndMinutes}
        </p>
      </div>
    );
  }
}

export { getAnswerMetaData, QuestionMetaData };