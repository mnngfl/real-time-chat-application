export const register = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", {
        scope: "/",
      })
      .then((registration) => {
        if (registration.installing) {
          console.log("Service worker installing");
        } else if (registration.waiting) {
          console.log("Service worker installed");
        } else if (registration.active) {
          console.log("Service worker active");
        }
      })
      .catch((error) => {
        console.error("Service worker registration failed: ", error);
      });
  } else {
    console.log("Service workers are not available.");
  }
};
