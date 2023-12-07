import "../../stylesheets/index.css";
import { QuestionMetaData, getQuestionMetaData } from "../../utils/metadata_generators";
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
  question,
  setCurrentPage,
  setCurrentQuestion,
}) => {
  return (
    <div className="result-item">
      <div className="result-item-stats">
        <p>{question.answers.length} answers</p>
        <p>{question.views} views</p>
      </div>
      <div className="result-item-title-and-tag">
        <p
          className="question-title"
          onClick={() => {
            setCurrentQuestion(question);
            setCurrentPage("Answers");
          }}
        >
          {question.title}
        </p>
        <div className="result-item-tag-list">
        {question.tags.map((tag) => tagsListItem(tag))}

        </div>
      </div>
      <div className="result-item-author-and-time">
      <div>
        <QuestionMetaData question={question} />
      </div>
      </div>
    </div>
  );
};

export default ResultListItem;
