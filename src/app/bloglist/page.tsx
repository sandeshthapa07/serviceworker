"use client";

import { useEffect, useState } from "react";

const Page = () => {
  const [bloglist, setBloglist] = useState([]);
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts").then(
      async (response) => {
        setBloglist(await response.json());
      }
    );
  }, []);

  return (
    <div className="flex min-h-screen flex-row flex-wrap gap-4  justify-between p-24">
      {bloglist.map((blog: { id: number; title: string; body: string }) => (
        <div
          key={blog?.id}
          className="flex w-[300px] flex-col gap-3 bg-gray-50 p-4 cursor-pointer shadow-lg"
        >
          <h1 className="text-lg font-bold">{blog?.title}</h1>
          <p className="text-sm">{blog?.body}</p>
        </div>
      ))}
    </div>
  );
};

export default Page;
