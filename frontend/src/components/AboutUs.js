import React from "react";
import './AboutUs.css';
import Footer from "./Footer";
import { Box } from "@mui/material";

const AboutUs = () => {
  return (
    <Box>
      <div className="about-us">
        {/* Header Section */}
        <div className="header-container">
          <h1>Making Futsal Booking Easier</h1>
          <p>
            We are on a mission to simplify futsal court bookings, making it quick, easy, and hassle-free for players and court owners alike.
          </p>
        </div>

        {/* Our Vision */}
        <div className="grid our-vision">
          <img src="/images/FutsalCourt1.jpg" alt="Futsal Game" className="h-full" />
          <div className="text-container">
            <h2>A Platform for Futsal Enthusiasts</h2>
            <p>
              Our goal is to connect players with the best futsal courts available. Whether you're booking for a casual game or an intense match, we ensure a seamless experience.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-10 features-section">
          <div className="text-white rounded-lg shadow-md w-full flex items-center p-12">
            <div className="text-container">
              <h2 className="text-4xl font-bold mb-4">Smart Features for Players</h2>
              <p className="text-lg leading-relaxed">
                We provide real-time availability, seamless payments, player matchmaking, and exclusive deals for frequent bookers.
              </p>
            </div>
          </div>
          <div className="relative w-full h-full">
            <img 
              src="/images/FutsalCourt2.jpeg" 
              alt="Booking App" 
              className="rounded-lg shadow-md w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Additional Section 1 */}
        <div className="grid md:grid-cols-2 gap-6 mt-10 additional-section-1">
          <div className="relative w-full h-full">
            <img 
              src="/images/FutsalCourt3.jpeg" 
              alt="Player Experience" 
              className="rounded-lg shadow-md w-full h-full object-cover"
            />
          </div>
          <div className="text-white rounded-lg shadow-md w-full flex items-center p-12">
            <div className="text-container">
              <h2 className="text-4xl font-bold mb-4">Elevating Player Experience</h2>
              <p className="text-lg leading-relaxed">
                From friendly matches to competitive leagues, we are here to support your futsal journey. Find courts, join teams, and be part of the community!
              </p>
            </div>
          </div>
        </div>

        {/* Additional Section 2 */}
        <div className="grid md:grid-cols-2 gap-6 mt-10 additional-section-2">
          <div className="text-white rounded-lg shadow-md w-full flex items-center p-12">
            <div className="text-container">
              <h2 className="text-4xl font-bold mb-4">Seamless Management for Court Owners</h2>
              <p className="text-lg leading-relaxed">
                Our platform provides court owners with tools to manage bookings, track availability, and reach more players, all in one simple dashboard.
              </p>
            </div>
          </div>
          <div className="relative w-full h-full">
            <img 
              src="/images/FutsalCourt4.jpeg" 
              alt="Court Management" 
              className="rounded-lg shadow-md w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Our Values Section */}
        <section className="our-values-section">
          <h1>Our Values</h1>
          <p>Our core values drive our commitment to making futsal accessible, enjoyable, and efficient for everyone.</p>
          
          <div className="value-cards">
            <div className="value-card">
              <h3>Player First</h3>
              <p>We prioritize the needs of futsal players, making it easy to book courts and enjoy the game.</p>
            </div>
            <div className="value-card">
              <h3>Community Focused</h3>
              <p>We foster connections between players, teams, and local courts to strengthen the futsal community.</p>
            </div>
            <div className="value-card">
              <h3>Transparent Process</h3>
              <p>We ensure clarity and fairness in bookings, pricing, and communication.</p>
            </div>
          </div>

          {/* Last Two Cards Centered and Side by Side */}
          <div className="value-cards double-card">
            <div className="value-card">
              <h3>Reliable Support</h3>
              <p>Our team is dedicated to assisting players and court owners whenever they need help.</p>
            </div>
            <div className="value-card">
              <h3>Passion for Futsal</h3>
              <p>We share your love for the game and are committed to enhancing every futsal experience.</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Box>
  );
};

export default AboutUs;
