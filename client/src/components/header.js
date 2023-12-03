import SearchBar from "./search-bar";

// AKA the banner
const Header = ({
  appModel,
  searchString,
  setSearchString,
  setCurrentPage,
  setSearchResults,
}) => {
  return (
    <header>
      <div className="aline">
        <li>
          <h1>Fake Stack Overflow</h1>
        </li>
        <li className="search-bar-container">
          <SearchBar
            appModel={appModel}
            searchString={searchString}
            setSearchString={setSearchString}
            setCurrentPage={setCurrentPage}
            setSearchResults={setSearchResults}
          />
        </li>
      </div>
    </header>
  );
};

export default Header;
