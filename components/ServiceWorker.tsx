"use client";

import { createContext, useEffect, useState } from "react";

// Create a context
export const SWContext = createContext({
  serviceWorker: null,
  contentFromSW: "",
});

const ServiceWorker = ({ children }: { children: React.ReactNode }) => {
  const [serviceWorker, setServiceWorker] = useState(null);
  const [contentFromSW, setContentFromSW] = useState("");
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register the service worker
      navigator.serviceWorker.register("/service-worker.js").then(
        function (registration) {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
          setServiceWorker(
            (registration.active as any) ||
              registration.waiting ||
              registration.installing
          );
        },
        function (err) {
          console.log("ServiceWorker registration failed: ", err);
        }
      );
      navigator.serviceWorker.addEventListener("controllerchange", async () => {
        navigator.serviceWorker.controller;
      });

      navigator?.serviceWorker?.addEventListener("message", (event) => {
        console.log("Message received from service worker:", event.data);
        setContentFromSW(event.data);
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <SWContext.Provider value={{ serviceWorker, contentFromSW }}>
        {children}
      </SWContext.Provider>
    </div>
  );
};

export default ServiceWorker;
