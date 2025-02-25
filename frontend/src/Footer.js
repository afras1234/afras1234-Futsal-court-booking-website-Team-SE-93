// src/components/Footer.js

import React from "react";
import "./Footer.css"; // Assuming your styles are in a file named Footer.css

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        {/* Left Side */}
        <div className="footer-left">
          <h2 className="brand-name">ArenaX</h2>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
          <button className="contact-btn">Contact Us</button>
          <div className="footer-bottom">
            <p>Copyright © 2024 All rights reserved</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="footer-right">
          <div className="footer-column">
            <h3>Navigation</h3>
            <ul>
              <li><a href="#">Courts</a></li>
              <li><a href="#">Home</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Events</a></li>
              <li><a href="#">Facilities</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Our mission and vision</a></li>
              <li><a href="#">Our team</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Login</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
