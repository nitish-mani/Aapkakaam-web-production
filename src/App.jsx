import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Homepage from "./components/HomePage";
import Body from "./components/body/body";
import Login from "./components/login/login";
import SignUp from "./components/signup/signup";
import { Provider } from "react-redux";
import store from "./utils/store";
import ViewOrders from "./components/veiw/viewOrders";
import ViewShare from "./components/veiw/viewShare";
import Category from "./components/category/category";
import Bookings from "./components/bookings/Bookings";
import Address from "./components/Address/Address";
import AvailableVendor from "./components/availableVendor/availableVendor";
import CheckBookingDate from "./components/checkBookingDate/checkBookingDate";
import Share from "./components/share/share";
import ChangePhoneEmailPassword from "./components/changePhoneEmail&Password/changePhoneEmail&Password";
import UploadImage from "./components/uploadImage/uploadImage";
// import AddMoney from "./components/addMoney/addMoney";
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

export default function App() {
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
          path: "/uploads",
          element: <UploadImage />,
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
      ],
    },

    { path: "/paymentSuccessful", element: <PaymentSuccess /> },
    { path: "/paymentFailed", element: <PaymentFailed /> },
    {
      path: "/transactionHistory",
      element: <TransactionStats />,
    },
  ]);
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}
