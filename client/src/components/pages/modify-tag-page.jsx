import React, { useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
const ModifyTagPage = ({tag}) => {
  const [tagName, setTagName] = useState("");


  const handleDeleteTagClick = async () => {
    let config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://localhost:8000/api/tags_v2?tag_name=${tagName}`,
      headers: {},
      withCredentials: true,
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleModifyTagClick = async (event) => {
    event.preventDefault();
    let data = JSON.stringify({
      "tag_id": tag._id,
      "name": tagName,
    });
    
    let config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: 'http://localhost:8000/api/tags_v2',
      headers: { 
        'Content-Type': 'application/json', 
      },
      data : data,
      withCredentials: true,
    };
    
    await axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }
  return (
    <div className="form">
      <form
        onSubmit={(event) => handleModifyTagClick(event)}
        style={{ flexGrow: 1 }}
      >
        <h1>Tag Name*</h1>
        <input
          type="text"
          className="single-line-textbox"
          id="question-title-input"
          required
          minLength="1"
          maxLength="50"
          onChange={(event) => setTagName(event.target.value)}
        />

        <div
          style={{ display: "flex", flexDirection: "row", marginTop: "3vh" }}
        >
          <input type="submit" value="Edit Tag" className="button-blue" />
          <Button variant="contained" onClick={ async () => await handleDeleteTagClick()}>Delete Tag</Button>
          <div style={{ flexGrow: 1 }}></div>
          <p style={{ color: "red" }}> * indicated mandatory fields</p>
        </div>
      </form>
    </div>
  );

}

export default ModifyTagPage;