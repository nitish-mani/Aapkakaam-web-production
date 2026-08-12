import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategory } from "../../utils/categoryslice";
import "./category.css";
import AdsterraBanner from "../../ads/adsterraNativeBanner";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";

const RightArrowIcon = () => (
  <svg
    className="right-arrow"
    fill="none"
    strokeWidth={2}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
    />
  </svg>
);

export default function Category() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cd, id } = useParams();

  const handleLogin = (userType) => {
    dispatch(setCategory(userType));
    localStorage.setItem("category", userType);
    navigate("/login", {
      state: {
        category: userType,
        cd,
        id,
      },
    });
  };

  const loginOptions = [
    { label: "Continue As a User", type: "user" },
    { label: "Continue As a Vendor", type: "vendor" },
  ];

  return (
    <div
      className="category"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <AdsterraBanner_320x50 />

      <div className="category-child">
        {loginOptions.map((option) => (
          <div
            key={option.type}
            onClick={() => handleLogin(option.type)}
            role="button"
            tabIndex={0}
            aria-label={`Login as ${option.type}`}
            onKeyDown={(e) => e.key === "Enter" && handleLogin(option.type)}
          >
            {option.label}
            <RightArrowIcon />
          </div>
        ))}
      </div>
      <AdsterraBanner />
    </div>
  );
}
