import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import ProtectedRoute from "./context/ProtectedRoute";

import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import ForAccoutToActivated from "./components/contact/ForAccoutToActivated";
import AddFees from "./components/feestructure/AddFees";
import EditFee from "./components/feestructure/EditFee";
import ViewFee from "./components/feestructure/ViewFee";
import BalancePerClass from "./components/finance/BalancePerClass";
import TotalBalance from "./components/finance/TotalBalance";
import TotalFeePaid from "./components/finance/TotalFeePaid";
import Home from "./components/home/Home";
import AddPayment from "./components/paymets/Addpayment";
import EditPayment from "./components/paymets/EditPayment";
import FilterStudentsBalance from "./components/paymets/filterBalance";
import StudentPaymentStatement from "./components/paymets/StudentPaymentStatement";
import ViewPayments from "./components/paymets/ViewPayments";
import AddRemedialPayment from "./components/remedialPayment/AddRemedialpayment";
import EditRemedialPayment from "./components/remedialPayment/EditRemedialPayment";
import FilterRemedialBalance from "./components/remedialPayment/filterRemedialBalance";
import RemedialPaymentStatement from "./components/remedialPayment/remedialPaymentStatement";
import ViewRemedialPayments from "./components/remedialPayment/ViewRemedialPayments";
import AddRemedial from "./components/remedialStructure/AddRemedial";
import EditRemedial from "./components/remedialStructure/EditRemedial";
import FilterStudentsByBalance from "./components/remedialStructure/filterBalance";
import ViewRemedial from "./components/remedialStructure/ViewRemedial";
import Addstudent from "./components/students/Addstudent";
import Editstudent from "./components/students/Editstudent";
import Searchstudent from "./components/students/Searchstudent";
import ViewStudents from "./components/students/ViewStudents";
import ChangePasword from "./components/users/ChangePasword";
import ManageAccount from "./components/users/ManageAccount";
import Profile from "./components/users/Profile";
import CookieExpire from "./context/CookieExpire";
import Dashboard from "./dasboard/Dashboard";
import Error from "./error/Error";
import Layout from "./layout/Layout";
import Login from "./pages/login/Login";
import ChangePassword from "./pages/password/ChangePassword";
import Password from "./pages/password/Password";
import ResetPassword from "./pages/password/ResetPassword";
import Register from "./pages/register/Register";
  function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Unprotected */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error />} />
        <Route path="/change-password/:token" element={<ChangePassword />} />
        <Route path="/reset-password/" element={<ResetPassword />} />
        <Route path="/for-account-to-activated" element={<ForAccoutToActivated />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/viewstudents" element={<ViewStudents />} />
          <Route path="/addstudent" element={<Addstudent />} />
          <Route path="/editstudent/:id" element={<Editstudent />} />
          <Route path="/searchstudent" element={<Searchstudent />} />
          <Route path="/viewPayment" element={<ViewPayments />} />
          <Route path="/addpayment" element={<AddPayment />} />
          <Route path="/editpayment/:id" element={<EditPayment />} />
          <Route path="/filterfeebalance" element={<FilterStudentsBalance/>}/>
          <Route path="/addfee" element={<AddFees />} />
          <Route path="/remedial" element={<ViewRemedial/>}/>
          <Route path="/editremedial/:id" element={<EditRemedial/>}/>
          <Route path="/filterremedial" element={<FilterStudentsByBalance/>}/>
          <Route path="/addremedial" element={<AddRemedial/>}/>
          <Route path="/editremedialpayment/:id" element={<EditRemedialPayment/>}/>
          <Route path="/addRemedialPayment" element={<AddRemedialPayment/>}/>
          <Route path="/viewremedialpayments" element={<ViewRemedialPayments/>}/>
          <Route path="/filterremedialbalance" element={<FilterRemedialBalance/>}/>
          <Route path="/editfee/:id" element={<EditFee />} />
          <Route path="/viewfee" element={<ViewFee />} />
          <Route path="/payment-statement/:studentId" element={<StudentPaymentStatement/>}/>
          <Route path="/remedial-payment-statement/:studentId"element={<RemedialPaymentStatement/>}/>
          <Route path="/balanceperclass" element={<BalancePerClass />} />
          <Route path="/totalbalance" element={<TotalBalance />} />
          <Route path="/totalfeepaid" element={<TotalFeePaid />} />
          <Route path="/cookie-expire" element={<CookieExpire />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/manage" element={<ManageAccount />} />
          <Route path="/changepassword" element={<ChangePasword />} />
          <Route path="/password" element={<Password />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
