
const TotalFeePaid = () => {
  return (
    <div>
        <h2>Total Fee Paid</h2>
        <table className="table table-striped">
            <thead>
            <tr>
                <th>Student Name</th>
                <th>Class</th>
                <th>Amount Paid</th>
                <th>Date of Payment</th>
            </tr>
            </thead>
            <tbody>
            {/* Example data, replace with actual data from your state or props */}
            <tr>
                <td>John Doe</td>
                <td>10A</td>
                <td>$500</td>
                <td>2023-10-01</td>
            </tr>
            <tr>
                <td>Jane Smith</td>
                <td>10B</td>
                <td>$450</td>
                <td>2023-10-02</td>
            </tr>
            </tbody>
        </table>
    </div>
  )
}

export default TotalFeePaid
