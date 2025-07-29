import { Link } from "react-router-dom";
import "./home.css";
const Home = () => {
  return (
    <>
      <div className="hero-section">
        <h1 style={{ color: "white" }}>Welcome to Fee Tracka</h1>
        <p style={{ color: "yellowgreen", fontSize: "1rem" }}>
          Fee Tracka is a smart and intuitive school finance management platform designed to assist clerks and school administrators in managing student fee records effortlessly.<br />
          Our mission is to simplify school fee tracking, improve transparency, and make financial reporting easier for educational institutions.
          <br />
          For more click about 
        </p>
        <div className="cta-buttons">
          <Link to="/register">
            <button>Get started</button>
          </Link>
          <Link to="/about">
            <button>About</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
