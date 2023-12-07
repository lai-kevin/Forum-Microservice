export default function searchQuestions(searchString) {
    searchString = searchString.toLowerCase();
    var questions = new Set();

    //Search for titles and texts with at least one word in the search string
    var searchStringWords = searchString
      .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
      .split(" ");
    searchStringWords = searchStringWords.filter((word) => {
      if (word.trim().length === 0) {
        return false;
      } else {
        return true;
      }
    });
    searchStringWords.forEach((word) => {
      var resultQuestions = this.data.questions.filter((question) => {
        return (
          question.title
            .toLowerCase()
            .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
            .split(" ")
            .find((titleWord) => word === titleWord) ||
          question.text
            .toLowerCase()
            .replace(/[{}=\-_`~().,^&*/#!$%;:]/g, " ")
            .split(" ")
            .find((textWord) => word === textWord)
        );
      });
      resultQuestions.forEach((question) => {
        questions.add(question);
      });
    });
}