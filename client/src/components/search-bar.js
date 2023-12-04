const SearchBar = ({
  appModel,
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
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setCurrentPage("Search");
            setSearchResults(appModel.searchQuestions(searchString));
          }
        }}
        style={{border: 'solid'}}
      />
    </div>
  );
};

export default SearchBar;
