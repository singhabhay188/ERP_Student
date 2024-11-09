import { useState } from "react";

const useFetch = (asyncFunction: Function) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const fn = async (...args: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      return null;
    }
  };

  return { loading, error, data, fn };
};

export default useFetch;