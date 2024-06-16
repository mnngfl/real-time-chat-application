/* eslint-disable no-undef */

export const register = () => {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", {
        scope: "/",
      })
      .then((registration) => {
        console.log("Service worker registration succeeded: ", registration);
      })
      .catch((error) => {
        console.error("Service worker registration failed: ", error);
      });
  } else {
    console.log("Service workers are not supported.");
  }
};
