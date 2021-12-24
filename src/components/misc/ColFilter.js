export const ColumnFilter = ({column}) => {
    const {filterValue, setFilter, preFilteredRows} = column
    const count = preFilteredRows.length
    return (
      <div
      className="text-xs text-left ">
        Filter:{' '}
        <br/>
        <input
          className="text-xs text-left border border-blueGray-200"
          style={
            {
              paddingTop:'2px',
              paddingBottom:'2px',
              paddingLeft:'12px',
            }
          }
          value={filterValue || ''}
          onChange={(e) => setFilter(e.target.value || undefined)}
          placeholder={`Search ${count} records...`}
        />
      </div>
    )
  }