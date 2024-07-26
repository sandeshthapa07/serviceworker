self.onmessage = (event) => {
  const n = event.data;
  const result = fibonacci(n);
  self.postMessage(result);
};

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
