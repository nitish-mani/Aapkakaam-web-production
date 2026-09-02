import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./utils/store";

// ============================================================
// PAGES / COMPONENTS
// ============================================================

import Homepage from "./components/HomePage";
import Body from "./components/body/body";
import Login from "./components/login/login";
import SignUp from "./components/signup/signup";
import ViewOrders from "./components/veiw/viewOrders";
import ViewShare from "./components/veiw/viewShare";
import Category from "./components/category/category";
import Bookings from "./components/bookings/Bookings";
import Address from "./components/Address/Address";
import AvailableVendor from "./components/availableVendor/availableVendor";
import CheckBookingDate from "./components/checkBookingDate/checkBookingDate";
import Share from "./components/share/share";
import ChangePhoneEmailPassword from "./components/changePhoneEmail&Password/changePhoneEmail&Password";
// import UploadImage from "./components/uploadImage";

import PrivacyPolicy from "./pages/privacyPolicy";
import TermsAndConditions from "./pages/termsAndConditions";
import AboutUs from "./pages/aboutUs";
import ContactUs from "./pages/contactUs";

import DiscountCard from "./payments/checkoutPage";
import PaymentSuccess from "./payments/paymentSuccessful";
import PaymentFailed from "./payments/failedPayment";
import Earnings from "./components/share/earnings";
import AttendanceReport from "./components/Attendance/attendanceReport";
import TransactionStats from "./payments/TransactionStats";
import LeaveManagement from "./components/Leave Management/leaveManagement";
import Concern from "./components/Concern";
import Profile from "./components/profile/profile";

// ============================================================
// MAINTENANCE
// ============================================================

import useWebsiteMaintenance from "./hooks/useWebsiteMaintenance";
import MaintenancePage from "./components/MaintenancePage";
import MaintenanceBanner from "./components/MaintenanceBanner";

// ============================================================
// ROUTER
// ============================================================

const router = createBrowserRouter([
  {
    path: "/aboutUs",
    element: <AboutUs />,
  },

  {
    path: "/contactUs",
    element: <ContactUs />,
  },

  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },

  {
    path: "/terms",
    element: <TermsAndConditions />,
  },

  {
    path: "/",
    element: <Homepage />,

    children: [
      {
        path: "/",
        element: <Body />,
      },

      {
        path: "/profile",
        element: <Profile />,
      },

      {
        path: "/category",
        element: <Category />,
      },

      {
        path: "/category/:cd/:id",
        element: <Category />,
      },

      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/signup",
        element: <SignUp />,
      },

      {
        path: "/viewOrders",
        element: <ViewOrders />,
      },

      {
        path: "/viewShare",
        element: <ViewShare />,
      },

      {
        path: "/viewBookings",
        element: <Bookings />,
      },

      {
        path: "/bookNow",
        element: <Bookings />,
      },

      {
        path: "/address",
        element: <Address />,
      },

      {
        path: "/availableVendor",
        element: <AvailableVendor />,
      },

      {
        path: "/checkBookingDate",
        element: <CheckBookingDate />,
      },

      {
        path: "/share",
        element: <Share />,
      },

      {
        path: "/editPhoneEmail",
        element: <ChangePhoneEmailPassword />,
      },

      {
        path: "/addMoney",
        element: <DiscountCard />,
      },

      {
        path: "/earnings",
        element: <Earnings />,
      },

      {
        path: "/attendanceReport",
        element: <AttendanceReport />,
      },

      {
        path: "/leaveManagement",
        element: <LeaveManagement />,
      },

      {
        path: "/concern",
        element: <Concern />,
      },

      {
        path: "/paymentSuccessful",
        element: <PaymentSuccess />,
      },

      {
        path: "/paymentFailed",
        element: <PaymentFailed />,
      },

      {
        path: "/transactionHistory",
        element: <TransactionStats />,
      },
    ],
  },
]);

// ============================================================
// WEBSITE CONTENT
// ============================================================

function WebsiteContent({ showBanner, maintenanceData }) {
  return (
    <>
      {showBanner && <MaintenanceBanner data={maintenanceData} />}

      <RouterProvider router={router} />
    </>
  );
}

// ============================================================
// MAINTENANCE GATE
// ============================================================

function MaintenanceGate() {
  const { data, loading, maintenance, showBanner, showMaintenancePage } = useWebsiteMaintenance();

  // ----------------------------------------------------------
  // LOADING
  //
  // We do NOT block the website while checking maintenance.
  // The website can load normally.
  // ----------------------------------------------------------

  if (loading) {
    return <RouterProvider router={router} />;
  }

  // ----------------------------------------------------------
  // ACTIVE MAINTENANCE
  //
  // The backend explicitly controls this.
  // Full website is replaced by MaintenancePage.
  // ----------------------------------------------------------

  if (maintenance === true && showMaintenancePage === true) {
    return <MaintenancePage data={data} />;
  }

  // ----------------------------------------------------------
  // NORMAL WEBSITE / UPCOMING MAINTENANCE
  // ----------------------------------------------------------

  return <WebsiteContent showBanner={showBanner} maintenanceData={data} />;
}

// ============================================================
// APP
// ============================================================

export default function App() {
  return (
    <Provider store={store}>
      <MaintenanceGate />{" "}
    </Provider>
  );
}
