import { useEffect, useState } from "react";

export function useSSE(url: string) {
  const [data, setData] = useState<any[] | null>(null);

  useEffect(() => {
    const source = new EventSource(url);

    source.onmessage = function logEvents(event) {
      setData(JSON.parse(event.data));
    };

    return () => {
      source.close();
    };
  }, [url]);

  return data;
}
