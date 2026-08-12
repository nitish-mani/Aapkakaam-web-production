import axios from "axios";
import Swal from "sweetalert2";

const baseConfig = {
  confirmButtonColor: "#2563EB",
  allowOutsideClick: false,
  allowEscapeKey: true,
  timerProgressBar: true,

  customClass: {
    title: "swal-title",
    htmlContainer: "swal-text",
    confirmButton: "swal-confirm",
    cancelButton: "swal-confirm",
  },
};

export const showSuccess = (message, title = "Success", timer = 2000) => {
  return Swal.fire({
    ...baseConfig,
    icon: "success",
    title,
    text: message,
    timer,
  });
};

export const showError = (message, title = "Error") => {
  return Swal.fire({
    ...baseConfig,
    icon: "error",
    title,
    text: message,
  });
};

export const showWarning = (message, title = "Warning") => {
  return Swal.fire({
    ...baseConfig,
    icon: "warning",
    title,
    text: message,
  });
};

export const showInfo = (message, title = "Information") => {
  return Swal.fire({
    ...baseConfig,
    icon: "info",
    title,
    text: message,
  });
};

export const showQuestion = (message, title = "Question") => {
  return Swal.fire({
    ...baseConfig,
    icon: "question",
    title,
    text: message,
  });
};

export const showConfirm = async ({
  title = "Are you sure?",
  text = "",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "warning",
}) => {
  const result = await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result;
};
