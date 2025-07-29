
const Searchstudent = () => {
  return (
      <main className="sb-nav-fixed">
      <div className="container-fluid px-4">
        <h1 className="mt-4 d-flex justify-content-between">Search Students by balances</h1>
          <div className="mb-3">
                      <label htmlFor="exampleFormControlSelect1" className="form-label">Select Class</label>
    <select class="form-control" id="exampleFormControlSelect1">
      <option>--Select Class--</option>
      <option>Form 2</option>
      <option>Form 3</option>
      <option>Fomr 4</option>
    </select>
  </div>
                  <div className="mb-3">
                        <label htmlFor="searchInput" className="form-label">Search by balance</label>
                        <input type="number" className="form-control" id="searchInput" placeholder="Enter balance" />
                        
                  </div>
                    <button className="btn btn-success mb-1">Search</button>
                    <span class="d-flex justify-content-end">
                        <button className="btn btn-warning mb-3">Print</button>
                    </span>
    <table className="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Full Name</th>
      <th scope="col">Adm No.</th>
      <th scope="col">Form</th>
       <th scope="col">Parent Name</th>
      <th scope="col">Parent Contact</th>
        <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
        <td>John Doe</td>
        <td>+254712345678</td>
        <td>
            <button className="btn btn-primary btn-sm me-3">Edit</button>
            <button className="btn btn-danger btn-sm">Delete</button>
        </td>

    
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
       <td>John Doe</td>
        <td>+254712345678</td>
        <td>
            <button className="btn btn-primary btn-sm me-3">Edit</button>
            <button className="btn btn-danger btn-sm">Delete</button>
        </td>

    </tr>
    <tr>
      <th scope="row">3</th>
      <td colspan="2">Larry the Bird</td>
      <td>@twitter</td>
       <td>John Doe</td>
        <td>+254712345678</td>
        <td>
            <button className="btn btn-primary btn-sm me-3">Edit</button>
            <button className="btn btn-danger btn-sm">Delete</button>
        </td>

    </tr>
  </tbody>
</table>
</div>
      </main>
  )
}

export default Searchstudent
