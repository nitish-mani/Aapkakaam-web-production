// Modern Alert & Toast Component - AapkaKaam (FIXED - Single Instance)

import Swal from "sweetalert2";
import "./showAlert.css";

// Language helper
let currentLanguage = "en";

export const setAlertLanguage = (lang) => {
  currentLanguage = lang;
};

const t = (en, hi) => {
  return currentLanguage === "hin" ? hi : en;
};

// ============================================================
// SINGLE INSTANCE MANAGER
// ============================================================

let activeAlert = null;

const closeActiveAlert = () => {
  if (activeAlert) {
    try {
      activeAlert.close();
    } catch (e) {
      // Ignore
    }
    activeAlert = null;
  }
};

// ============================================================
// THEME CONFIGURATION
// ============================================================

const themeConfig = {
  light: {
    background: "#ffffff",
    color: "#0f172a",
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#ef4444",
    backdrop: "rgba(0,0,0,0.4)",
  },
  dark: {
    background: "#1e293b",
    color: "#f1f5f9",
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#f87171",
    backdrop: "rgba(0,0,0,0.7)",
  },
};

const getTheme = () => {
  const prefersDark = themeConfig.light;
  return prefersDark;
};

// ============================================================
// BASE CONFIG
// ============================================================

const getBaseConfig = () => {
  const theme = themeConfig.light;
  return {
    confirmButtonColor: theme.confirmButtonColor,
    cancelButtonColor: theme.cancelButtonColor,
    allowOutsideClick: true,
    allowEscapeKey: true,
    timerProgressBar: true,
    background: theme.background,
    color: theme.color,
    backdrop: theme.backdrop,
    customClass: {
      title: "swal-title-modern",
      htmlContainer: "swal-text-modern",
      confirmButton: "swal-confirm-modern",
      cancelButton: "swal-cancel-modern",
      popup: "swal-popup-modern",
      timerProgressBar: "swal-progress-modern",
    },
  };
};

// ============================================================
// ICON CONFIG
// ============================================================

const icons = {
  success: {
    emoji: "✅",
    color: "#22c55e",
    bg: "#f0fdf4",
  },
  error: {
    emoji: "❌",
    color: "#ef4444",
    bg: "#fef2f2",
  },
  warning: {
    emoji: "⚠️",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  info: {
    emoji: "ℹ️",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  question: {
    emoji: "❓",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
};

// ============================================================
// MAIN FUNCTIONS
// ============================================================

export const showSuccess = (message, title = "Success", timer = 2500) => {
  if (!message) return Promise.resolve();
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  activeAlert = Swal.fire({
    ...baseConfig,
    icon: "success",
    title: t(title, "सफलता"),
    text: message,
    timer: timer,
    iconColor: icons.success.color,
    showClass: {
      popup: "swal-popup-slide-in",
    },
    hideClass: {
      popup: "swal-popup-slide-out",
    },
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-success",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return activeAlert;
};

export const showError = (message, title = "Error") => {
  if (!message) return Promise.resolve();
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  activeAlert = Swal.fire({
    ...baseConfig,
    icon: "error",
    title: t(title, "त्रुटि"),
    text: message,
    timer: 3000,
    timerProgressBar: true,
    iconColor: icons.error.color,
    showClass: {
      popup: "swal-popup-shake",
    },
    hideClass: {
      popup: "swal-popup-slide-out",
    },
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-error",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return activeAlert;
};

export const showWarning = (message, title = "Warning") => {
  if (!message) return Promise.resolve();
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  activeAlert = Swal.fire({
    ...baseConfig,
    icon: "warning",
    title: t(title, "चेतावनी"),
    text: message,
    timer: 3000,
    timerProgressBar: true,
    iconColor: icons.warning.color,
    customClass: {
      popup: "swal-popup-modern swal-warning",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return activeAlert;
};

export const showInfo = (message, title = "Information") => {
  if (!message) return Promise.resolve();
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  activeAlert = Swal.fire({
    ...baseConfig,
    icon: "info",
    title: t(title, "जानकारी"),
    text: message,
    timer: 3000,
    timerProgressBar: true,
    iconColor: icons.info.color,
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-info",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return activeAlert;
};

export const showQuestion = (message, title = "Question") => {
  if (!message) return Promise.resolve();
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  activeAlert = Swal.fire({
    ...baseConfig,
    icon: "question",
    title: t(title, "प्रश्न"),
    text: message,
    timer: 3000,
    timerProgressBar: true,
    iconColor: icons.question.color,
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-question",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return activeAlert;
};

// ============================================================
// CONFIRM DIALOG
// ============================================================

export const showConfirm = async ({
  title = "Are you sure?",
  text = "",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "warning",
  confirmColor = null,
}) => {
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  const iconConfig = icons[icon] || icons.info;

  const result = await Swal.fire({
    ...baseConfig,
    title: t(title, "क्या आप निश्चित हैं?"),
    text: t(text, text),
    icon: icon,
    iconColor: iconConfig.color,
    showCancelButton: true,
    confirmButtonText: t(
      confirmButtonText,
      confirmButtonText === "Yes" ? "हाँ" : confirmButtonText,
    ),
    cancelButtonText: t(
      cancelButtonText,
      cancelButtonText === "Cancel" ? "रद्द करें" : cancelButtonText,
    ),
    reverseButtons: true,
    confirmButtonColor: confirmColor || baseConfig.confirmButtonColor,
    cancelButtonColor: baseConfig.cancelButtonColor,
    showClass: {
      popup: "swal-popup-slide-in",
    },
    hideClass: {
      popup: "swal-popup-slide-out",
    },
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-confirm-dialog",
      confirmButton: "swal-confirm-modern swal-confirm-primary",
      cancelButton: "swal-cancel-modern swal-cancel-danger",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return result;
};

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

export const showToast = (message, type = "info", duration = 3000, position = "top-end") => {
  if (!message) return Promise.resolve();
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  const iconConfig = icons[type] || icons.info;

  activeAlert = Swal.fire({
    toast: true,
    position: position,
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    background: baseConfig.background,
    color: baseConfig.color,
    iconColor: iconConfig.color,
    customClass: {
      popup: "swal-toast-modern",
      timerProgressBar: "swal-progress-modern",
    },
    showClass: {
      popup: "swal-toast-slide-in",
    },
    hideClass: {
      popup: "swal-toast-slide-out",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return activeAlert;
};

// ============================================================
// LOADING DIALOG
// ============================================================

export const showLoading = (message = "Loading...", title = "") => {
  closeActiveAlert();

  const baseConfig = getBaseConfig();

  activeAlert = Swal.fire({
    ...baseConfig,
    title: t(title, title),
    text: t(message, message),
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-loading",
    },
    willClose: () => {
      activeAlert = null;
    },
  });

  return activeAlert;
};

// ============================================================
// CUSTOM MODAL
// ============================================================

export const showCustomModal = ({
  title = "",
  html = "",
  confirmButtonText = "OK",
  cancelButtonText = "Cancel",
  showCancelButton = false,
  icon = "info",
  width = "500px",
  onConfirm = null,
  onCancel = null,
}) => {
  closeActiveAlert();

  const baseConfig = getBaseConfig();
  const iconConfig = icons[icon] || icons.info;

  return Swal.fire({
    ...baseConfig,
    title: t(title, title),
    html: html,
    icon: icon,
    iconColor: iconConfig.color,
    showCancelButton: showCancelButton,
    confirmButtonText: t(confirmButtonText, confirmButtonText),
    cancelButtonText: t(cancelButtonText, cancelButtonText),
    width: width,
    reverseButtons: true,
    preConfirm: () => {
      if (onConfirm) {
        return onConfirm();
      }
      return true;
    },
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-custom-modal",
    },
    willClose: () => {
      activeAlert = null;
    },
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      return onConfirm(result);
    }
    if (result.isDismissed && onCancel) {
      return onCancel(result);
    }
    return result;
  });
};

// ============================================================
// CONFIRM DELETE
// ============================================================

export const showConfirmDelete = async ({
  title = "Delete Item",
  text = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmButtonText = "Delete",
  itemName = "",
}) => {
  closeActiveAlert();

  const baseConfig = getBaseConfig();

  return Swal.fire({
    ...baseConfig,
    title: t(title, "आइटम हटाएं"),
    html: `
      <div class="swal-delete-confirm">
        <div class="swal-delete-icon">🗑️</div>
        <p>${t(text, "क्या आप वाकई इस आइटम को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।")}</p>
        ${itemName ? `<div class="swal-delete-item">“${itemName}”</div>` : ""}
      </div>
    `,
    icon: "warning",
    iconColor: icons.warning.color,
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: baseConfig.cancelButtonColor,
    confirmButtonText: t(confirmButtonText, "हटाएं"),
    cancelButtonText: t("Cancel", "रद्द करें"),
    reverseButtons: true,
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-delete-modal",
      confirmButton: "swal-confirm-modern swal-confirm-danger",
      cancelButton: "swal-cancel-modern",
    },
    willClose: () => {
      activeAlert = null;
    },
  });
};

// ============================================================
// FORM DIALOG
// ============================================================

export const showFormDialog = ({
  title = "Enter Details",
  fields = [],
  confirmButtonText = "Submit",
  cancelButtonText = "Cancel",
}) => {
  closeActiveAlert();

  const baseConfig = getBaseConfig();

  let html = '<div class="swal-form-container">';
  fields.forEach((field) => {
    html += `
      <div class="swal-form-group">
        <label for="swal-field-${field.name}">${field.label}</label>
        <input 
          id="swal-field-${field.name}" 
          type="${field.type || "text"}" 
          placeholder="${field.placeholder || ""}"
          value="${field.value || ""}"
          ${field.required ? "required" : ""}
          class="swal-form-input"
        />
      </div>
    `;
  });
  html += "</div>";

  return Swal.fire({
    ...baseConfig,
    title: t(title, title),
    html: html,
    showCancelButton: true,
    confirmButtonText: t(confirmButtonText, confirmButtonText),
    cancelButtonText: t(cancelButtonText, cancelButtonText),
    confirmButtonColor: baseConfig.confirmButtonColor,
    cancelButtonColor: baseConfig.cancelButtonColor,
    reverseButtons: true,
    preConfirm: () => {
      const result = {};
      fields.forEach((field) => {
        const el = document.getElementById(`swal-field-${field.name}`);
        if (el) {
          result[field.name] = el.value;
        }
      });
      return result;
    },
    customClass: {
      ...baseConfig.customClass,
      popup: "swal-popup-modern swal-form-modal",
    },
    willClose: () => {
      activeAlert = null;
    },
  });
};

// ============================================================
// CLOSE ALL ALERTS
// ============================================================

export const closeAllAlerts = () => {
  closeActiveAlert();
  try {
    Swal.close();
  } catch (e) {
    // Ignore
  }
};

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showQuestion,
  showConfirm,
  showToast,
  showLoading,
  showCustomModal,
  showConfirmDelete,
  showFormDialog,
  closeAllAlerts,
  setAlertLanguage,
};
