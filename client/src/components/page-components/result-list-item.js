import { getAnswers } from "../../models/question";
import { getTags } from "../../models/question";
import { getQuestionMetaData } from "../../models/question";
import { view } from "../../models/question";
import "../../stylesheets/index.css";
/**
 * Represents a JSX element for a tag item.
 *
 * @param {object} tag - The tag object
 * @returns {JSX.Element} - The JSX element displaying the name property of the tag object.
 */
function tagsListItem(tag) {
  return (
    <div className="tag-item" key={JSON.stringify(tag)}>
      <p>{tag.name}</p>
    </div>
  );
}

/**
 * Renders a single item in a list of search results for homepage and search result page.
 *
 * @param {Object} appModel - The application model object.
 * @param {Object} question - The question object that represents the question to be displayed.
 * @returns {JSX.Element} The rendered JSX code for the ResultListItem component.
 */
const ResultListItem = ({
  appModel,
  setModel,
  question,
  setCurrentPage,
  setCurrentQuestion,
}) => {
  return (
    <div className="result-item">
      <div className="result-item-stats">
        <p>{getAnswers(question, appModel).length} answers</p>
        <p>{question.views} views</p>
      </div>
      <div className="result-item-title-and-tag">
        <p
          className="question-title"
          onClick={() => {
            setCurrentQuestion(question._id);
            view(question, appModel, setModel).then(() => setCurrentPage("Answers"));
          }}
        >
          {question.title}
        </p>
        <div className="result-item-tag-list">
          {getTags(question, appModel).map((tag) => tagsListItem(tag))}
        </div>
      </div>
      <div className="result-item-author-and-time">
        {getQuestionMetaData(question)}
      </div>
    </div>
  );
};

export default ResultListItem;
