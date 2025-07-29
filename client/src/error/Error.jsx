import { Link } from 'react-router-dom';
const Error = () => {
  return (
    <main>
        <div className="container">
             <div className="row justify-content-center">
                  <div className="col-lg-6" style={{color: "whitesmoke"}}>
                      <div className="text-center mt-4">
                          <h1 className="display-1" style={{color: "white",fontWeight: "bold",}}>401</h1>
                      <p className="lead">Unauthorized</p>
                           <p>Access to this resource is denied.</p>
                             <Link to="/dashboard" style={{color: "white"}}>
                                <i className="fas fa-arrow-left me-1" ></i>
                                   Return to Dashboard
                                   </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
  )
}

export default Error
