import React from "react";

const AboutUs = () => {
  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: 800,
        margin: "auto",
        fontFamily: "sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1>About Us</h1>

      <p>
        Welcome to <strong>Aapkakaam.com</strong>, your trusted online
        marketplace connecting service providers and customers across India. Our
        mission is to make finding and booking reliable services simple,
        transparent, and affordable.
      </p>

      <h2>What We Offer</h2>
      <p>
        We provide a platform where service vendors can showcase their offerings
        and customers can book services easily. Whether you need home repairs,
        cleaning, tutoring, or any other service, AapKaKaam.com is your go-to
        solution.
      </p>

      <h2>Our Freemium Model</h2>
      <p>
        Vendors get the first 5 service bookings free of commission to help grow
        their business. After that, a nominal commission per order applies based
        on the service type. We also offer a "Share and Earn" program where
        users can earn rewards by sharing our platform with others.
      </p>

      <h2>Why Choose Us?</h2>
      <ul>
        <li>Trusted service providers with user ratings and reviews.</li>
        <li>Easy booking and transparent pricing.</li>
        <li>
          Secure platform with SMS notifications and user profile management.
        </li>
        <li>Personalized experience with ads served responsibly.</li>
      </ul>

      <h2>Our Vision</h2>
      <p>
        We aim to empower local service providers by giving them a digital
        platform and customers with easy access to quality services. Our goal is
        to build a community where both vendors and users benefit.
      </p>

      <h2>Contact Us</h2>
      <p>
        Have questions or feedback? Reach out to us anytime at{" "}
        <a href="mailto:support@aapkakaam.com">support@aapkakaam.com</a>.
      </p>
    </div>
  );
};

export default AboutUs;
