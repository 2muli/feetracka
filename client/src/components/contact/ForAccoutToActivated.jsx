// Contact.jsx
import "./contact.css"; // Import CSS for styling

const ForAccoutToActivated = () => {
  return (
    <div className="contact-container">
      <h4>YOUR ACCOUNT IS NOT ACTIVATED</h4>
      <p>
        For account activation contact admin using the contact details belows
      </p>
      {/* Contact Options */}
      <div className="contact-options">
        {/* Phone */}
        <div className="contact-card">
          <img
            src="images/whatApp.png"
            alt="Call Icon"
            className="contact-icon"
          />
          <h3>Call Us</h3>
          <p>
            <a href="tel:+254-792079900" className="contact-link">
              +254-792-079900
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForAccoutToActivated;
