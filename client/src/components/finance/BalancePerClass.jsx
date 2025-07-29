
const BalancePerClass = () => {
  return (
    <div>
        <h2>Balance Per Class</h2>
        <table className="table table-striped">
            <thead>
            <tr>
                <th>Class</th>
                <th>Total Fees Paid</th>
                <th>Total Fees Due</th>
            </tr>
            </thead>
            <tbody>
            {/* Example data, replace with actual data from your state or props */}
            <tr>
                <td>10A</td>
                <td>$5000</td>
                <td>$2000</td>
            </tr>
            <tr>
                <td>10B</td>
                <td>$4500</td>
                <td>$1500</td>
            </tr>
            </tbody>
        </table>
    </div>
  )
}

export default BalancePerClass
