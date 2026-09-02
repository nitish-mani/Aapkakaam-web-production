export const shouldShowAppDownload = (phoneNo) => {
  if (!phoneNo) return false;

  const dismissed = localStorage.getItem(`aapkakaam_app_prompt_${phoneNo}`);

  const downloaded = localStorage.getItem(`aapkakaam_app_download_${phoneNo}`);

  return !dismissed && !downloaded;
};
