import axios from "axios";
/**
 * @param {Model} appModel An instance of Model
 * @return {Array} Array of question objects
 */
//returns all question objects associated with this tag in an array
export async function getQuestions(tag) {
  let questions = [];
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8000/api/questions_v2?tag=${tag._id}`,
    headers: {},
  };

  await axios
    .request(config)
    .then((response) => {
      questions = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(questions)
  return questions;
}
