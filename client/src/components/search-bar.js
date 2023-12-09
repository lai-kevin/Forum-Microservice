import searchQuestions from "./utils/search";
const SearchBar = ({
  searchString,
  setSearchString,
  setCurrentPage,
  setSearchResults,
}) => {
  return (
    <div className="search-bar" style={{justifyContent: "center", alignItems: "center"}}>
      <input
        type="text"
        id="search"
        name="q"
        placeholder="Search...."
        onChange={(event) => {
          setSearchString(event.target.value);
        }}
        onKeyDown={ async (event) => {
          if (event.key === "Enter") {
            setCurrentPage("Search");
            setSearchResults((await searchQuestions(searchString)));
          }
        }}
        style={{border: 'solid'}}
      />
    </div>
  );
};

export default SearchBar;
