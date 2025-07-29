// Contact.jsx
import "./contact.css"; // Import CSS for styling

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>
      <h6>if you have any questions, feedback, or need support. We are here to help you with any inquiries you may have regarding our services, features, or any other aspect of our platform. Your satisfaction is our priority, and we aim to provide you with the best possible assistance. Whether you need help with account activation, have questions about our offerings, or simply want to share your thoughts, please don't hesitate to reach out to us. We value your input and are committed to ensuring you have a positive experience with our services. Our team is ready to assist you promptly and efficiently, so feel free to get in touch with us at any time. Thank you    
        </h6>
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

        {/* Email */}
        <div className="contact-card">
          <img
            src="images/email.png"
            alt="Email Icon"
            className="contact-icon"
          />
          <h3>Email Us</h3>
          <p>
            <a href="mailto:info@agriconnect.com" className="contact-link">
              info@agriconnect.com
            </a>
          </p>
        </div>

        {/* Facebook */}
        <div className="contact-card">
          <img
            src="images/fb.jpg"
            alt="Facebook Icon"
            className="contact-icon"
          />
          <h3>Follow on Facebook</h3>
          <p>
            <a
              href="https://www.facebook.com/agriconnectkenya"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              @AgriConnectKenya
            </a>
          </p>
        </div>

        {/* Twitter */}
        <div className="contact-card">
          <img
            src="images/twitter.png"
            alt="Twitter Icon"
            className="contact-icon"
          />
          <h3>Follow on Twitter</h3>
          <p>
            <a
              href="https://twitter.com/agriconnectke"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link"
            >
              @AgriConnectKE
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
