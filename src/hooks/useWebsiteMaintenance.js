import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL", API_URL);
const INITIAL_MAINTENANCE = {
  status: "inactive",
  active: false,
  upcoming: false,
  showBanner: false,
  showMaintenancePage: false,
  startDateTime: null,
  endDateTime: null,
  notificationStartTime: null,
};

export default function useWebsiteMaintenance() {
  const [maintenance, setMaintenance] = useState(INITIAL_MAINTENANCE);

  const [loading, setLoading] = useState(true);

  const checkMaintenance = useCallback(async () => {
    try {
      const url = `${API_URL}/website-maintenance/status?platform=website` + `&_t=${Date.now()}`;

      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache, no-store, max-age=0",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Maintenance API returned ${response.status}`);
      }

      const result = await response.json();
      const maintenanceData = result?.maintenance;

      if (!maintenanceData) {
        setMaintenance(INITIAL_MAINTENANCE);
        return;
      }

      setMaintenance({
        ...INITIAL_MAINTENANCE,
        ...maintenanceData,
      });
    } catch (error) {
      console.error("Maintenance check failed:", error);

      setMaintenance((previous) => ({
        ...previous,
        active: false,
        showMaintenancePage: false,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkMaintenance();

    // Check every 10 minutes.
    const interval = setInterval(checkMaintenance, 10 * 60 * 1000);

    // Refresh maintenance status when the user
    // returns to the browser tab.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkMaintenance();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkMaintenance]);

  return {
    // Complete API data
    data: maintenance,

    // Status
    status: maintenance.status,

    // Active maintenance
    maintenance: maintenance.active === true,

    // Upcoming maintenance
    upcoming: maintenance.upcoming === true,

    // UI controls
    showBanner: maintenance.showBanner === true,

    showMaintenancePage: maintenance.showMaintenancePage === true,

    // Dates
    startDateTime: maintenance.startDateTime,

    endDateTime: maintenance.endDateTime,

    notificationStartTime: maintenance.notificationStartTime,

    // Loading
    loading,

    // Manual refresh
    refreshMaintenance: checkMaintenance,
  };
}
