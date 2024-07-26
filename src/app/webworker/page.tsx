"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const Page = () => {
  const workerRef = useRef<Worker>();
  const [count, setCount] = useState(0);
  const [CalculatingW, setCalculatingW] = useState(false);
  const [Calculating, setCalculating] = useState(false);
  const [result, setResult] = useState(0);
  const [resultW, setResultW] = useState(0);
  const [isTrue, setIsTrue] = useState(false);

  useEffect(() => {
    workerRef.current = new Worker(new URL("/worker.js", import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<number>) => {
      setResultW(event.data);
      setCalculatingW(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleWork = async () => {
    setCalculatingW(true);
    workerRef.current?.postMessage(count);
  };

  function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  const handleWorkWithOut = async () => {
    setCalculating(true);
    const result = await fibonacci(count);
    setResult(result);
    setCalculating((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-4">
      <p>Do work in a WebWorker!</p>

      <div className="flex flex-col gap-4">
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          max="43"
          placeholder="Enter a number"
          className="w-full border p-4"
        />
      </div>

      <div className="flex gap-4 ">
        <div className="flex flex-col gap-4">
          <button
            className="border-2 py-2 px-4 rounded-lg bg-green-800 text-white"
            onClick={handleWork}
          >
            Calculate Fibo with web worker
          </button>
          {CalculatingW ? <p>Calculating...</p> : `Result: ${resultW}`}
        </div>

        <div className="flex flex-col gap-4">
          <button
            className="border-2 py-2 px-4 rounded-lg bg-green-800 text-white"
            onClick={handleWorkWithOut}
          >
            Calculate Fibo without web worker
          </button>
          {Calculating ? <p>Calculating...</p> : `Result: ${result}`}
        </div>
      </div>

      <div>
        <button onClick={() => setIsTrue(!isTrue)}>
          {isTrue ? "true" : "false"}
        </button>
      </div>
    </div>
  );
};

export default Page;
