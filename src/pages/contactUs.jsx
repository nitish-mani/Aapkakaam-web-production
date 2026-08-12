import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate your API or email sending logic
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: 600,
        margin: "auto",
        fontFamily: "sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1>Contact Us</h1>

      {submitted && (
        <p style={{ color: "green" }}>
          Thank you for reaching out! We will get back to you shortly.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="name"
            style={{ display: "block", fontWeight: "bold" }}
          >
            Name:
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
            placeholder="Your full name"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{ display: "block", fontWeight: "bold" }}
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="subject"
            style={{ display: "block", fontWeight: "bold" }}
          >
            Subject:
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
            placeholder="Brief subject"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="message"
            style={{ display: "block", fontWeight: "bold" }}
          >
            Message:
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
            placeholder="Write your message here..."
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>
      </form>

      <h2 style={{ marginTop: "2rem" }}>Other Contact Information</h2>
      <p>
        Email: <a href="mailto:support@aapkakaam.com">support@aapkakaam.com</a>
      </p>
      <p>Phone: +91-5568318482</p>
      <p>
        Address: Vill - Govindpur, Post - Baitalpur, Dist. - Deoria, Uttar
        Pradesh (274201)
      </p>
    </div>
  );
};

export default ContactUs;
