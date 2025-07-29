import { Link } from 'react-router-dom';
import './about.css'; // Optional: Style your about page

const About = () => {
  return (
    <div className="about-container2">
      <section className="about-section1">
        <h2>What is Fee Tracka?</h2>
        <p>
          Fee Tracka is a smart and intuitive school finance management platform designed to assist clerks and school administrators in managing student fee records effortlessly. Our mission is to simplify school fee tracking, improve transparency, and make financial reporting easier for educational institutions.
        </p>
        <p> With Fee Tracka, schools can manage fee balances, generate reports, and handle student records in a more efficient and error-free manner. </p>
        <p>Why use Fee Tracka?</p>
        <p>Fee Tracka offers several benefits to schools and educational institutions:</p>
        <p>Streamlined Fee Management: Fee Tracka provides a user-friendly interface for managing student fee records, making it easier for clerks and administrators to handle fee collections and balances.</p>
        <p>Improved Transparency: Fee Tracka offers real-time fee tracking and reporting, allowing schools to maintain accurate and up-to-date records of student fee balances and payments.</p>
        <p>Efficient Financial Reporting: Fee Tracka generates comprehensive financial reports, helping schools to analyze and manage their financial data effectively.</p>
        <p>Cost-Effective: Fee Tracka is a cost-effective solution for schools, as it eliminates the need for manual record-keeping and reduces administrative overhead.</p>
        <p>Easy to Use: Fee Tracka is designed to be user-friendly, making it easy for clerks and administrators to navigate and use the platform.</p>
        <p>Secure: Fee Tracka is designed to be secure, ensuring that student fee records are protected from unauthorized access and breaches.</p>
        <p>Customizable: Fee Tracka is customizable, allowing schools to tailor the platform to their specific needs and requirements.</p>
        <p>Mobile Access: Fee Tracka is mobile-friendly, allowing schools to access their fee records and reports from any device with an internet connection.</p>
        <p>Integration: Fee Tracka can be integrated with other school management systems, allowing schools to access their fee records and reports from any device with an internet connection.</p>
       <h5>How to use Fee Tracka?</h5>
       <p>You register and contact admin to activate your account</p>
       <p>After activation you login and start using the platform</p>
        <Link to="/register">
          <button style={{ marginBottom: "30px" }}>Start Now</button>
        </Link>
      </section>
    </div>
  );
};

export default About;
