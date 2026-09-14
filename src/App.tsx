import React, { useState, useEffect } from "react";
import { StudioWorkspace } from "./components/StudioWorkspace";

export default function App() {
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(Boolean(data.hasApiKey));
      })
      .catch((err) => {
        console.warn("Health check failed:", err);
      });
  }, []);

  return <StudioWorkspace hasApiKey={hasApiKey} />;
}
