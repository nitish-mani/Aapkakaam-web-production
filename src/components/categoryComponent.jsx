import "./categoryComponent.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function CategoryComponent({ category }) {
  const navigate = useNavigate();

  const lang = useSelector((store) => store.category.selectLanguage);

  const currentCategory = localStorage.getItem("category");

  const token = JSON.parse(localStorage.getItem(currentCategory))?.token;

  const [activeCard, setActiveCard] = useState("");

  const handleClick = (jobType) => {
    setActiveCard(jobType);

    setTimeout(() => {
      setActiveCard("");
    }, 120);

    setTimeout(() => {
      if (token) {
        navigate("/checkBookingDate", {
          state: {
            jobType,
          },
        });
      } else {
        navigate("/category");
      }
    }, 180);
  };

  return (
    <div className="category-section">
      <h2 className="category-title">
        {lang === "en" ? category.heading : category.headingHindi}
      </h2>

      <div className="category-grid">
        {category.services.map((service) => (
          <div
            key={service.jobType}
            className={`category-card ${
              activeCard === service.jobType ? "clicked" : ""
            }`}
            onClick={() => handleClick(service.jobType)}
          >
            <div className="image-container">
              <img src={service.image} alt={service.title} loading="lazy" />
            </div>

            <div className="service-name">
              {lang === "en" ? service.title : service.hindi}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
