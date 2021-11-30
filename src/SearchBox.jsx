
const SearchBox = (props) => {
  return (
    <input type='text' placeholder={'Search by ' + props.searchType} value={props.input} onChange={(e) => props.onChangeHandler(e.target.value)} />
  )
}

export default SearchBox;