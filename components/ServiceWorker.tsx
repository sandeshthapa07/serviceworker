"use client";

import { useEffect } from "react";

const ServiceWorker = ({ children }: { children: React.ReactNode }) => {
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     // Register the service worker
  //     navigator.serviceWorker.register("/service-worker.js").then(
  //       function (registration) {
  //         console.log(
  //           "ServiceWorker registration successful with scope: ",
  //           registration.scope
  //         );
  //       },
  //       function (err) {
  //         console.log("ServiceWorker registration failed: ", err);
  //       }
  //     );
  //     navigator.serviceWorker.addEventListener("controllerchange", async () => {
  //       navigator.serviceWorker.controller;
  //     });
  //   }
  // }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {children}
    </div>
  );
};

export default ServiceWorker;
