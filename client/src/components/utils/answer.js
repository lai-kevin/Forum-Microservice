import axios from "axios";

export const createAnswer = async (text, question) => {
  let data = JSON.stringify({
    question_id: question._id,
    text: text,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:8000/api/answers_v2",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    withCredentials: true,
  };
  
  let response;
  await axios
    .request(config)
    .then((response) => {
      response = response.data;
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

  return response;
};
