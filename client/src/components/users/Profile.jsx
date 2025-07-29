import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { isAuthenticated,userDetails } = useAuth();
    if (!isAuthenticated) {
        return <div className="alert alert-danger">You must be logged in to view this page.</div>;
    }   
  return (
<main>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-7">
                                <div className="card shadow-lg border-0 rounded-lg mt-5">
                                    <div className="card-header"><h3 className="text-center font-weight-light my-4">Profile</h3></div>
                                    <div className="card-body">
                                        <form>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input className="form-control" value={userDetails.user?.firstName} id="inputFirstName" type="text"  readOnly/>
                                                        <label htmlFor="inputFirstName">First name</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input className="form-control" value={userDetails.user?.secondName} id="inputLastName" type="text" readOnly />
                                                        <label htmlFor="inputLastName">Second name</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-3 mb-md-0">
                                                        <input className="form-control" value={userDetails.user?.lastName} id="inputFirstName" type="text"  readOnly/>
                                                        <label htmlFor="inputFirstName">Last name</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating">
                                                        <input className="form-control" value={userDetails.user?.phone} id="inputLastName" type="text" readOnly />
                                                        <label htmlFor="inputEmail">Phone Number</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-floating mb-3">
                                                <input className="form-control" id="inputEmail" value={userDetails.user?.email} type="email" readOnly />
                                                <label htmlFor="inputEmail">Email address</label>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="card-footer text-center py-3">
                                        <div className="small"><Link to="/dashboard" href="login.html">To the dashboard?Click here</Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
  )
}

export default Profile
