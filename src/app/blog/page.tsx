"use client";

import { useEffect, useState } from "react";

const Page = () => {
  const [text, setText] = useState("");
  const handleMessage = () => {
    console.log("message");
    sendMessage();
  };
  const [response, setResponse] = useState("");
  const [serviceWorker, setServiceWorker] = useState(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
          setServiceWorker(
            (registration.active as any) ||
              registration.waiting ||
              registration.installing
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    navigator?.serviceWorker?.addEventListener("message", (event) => {
      console.log("Message received from service worker:", event.data);
      //   setResponse(event.data);
    });
    // return () => {
    //   navigator.serviceWorker.removeEventListener("message", handleMessage);
    // };
  }, []);


  useEffect(() => {

  
    return () => {
      second
    }
  }, [third])
  

  const sendMessage = () => {
    if (serviceWorker) {
      (serviceWorker as any).postMessage({ text });
    }
  };

  return (
    <div>
      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 ">
          <label htmlFor="editor">Content</label>
          <textarea
            name="editor"
            onChange={(e) => setText(e.target.value)}
            id="editor"
            className="bg-gray-300 h-[200px] p-4 rounded=lg"
          />
        </div>
        <div className="flex justify-end ">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleMessage();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
