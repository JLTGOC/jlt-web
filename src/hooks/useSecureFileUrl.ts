import { useState, useEffect } from "react";
import { GET } from "@/lib/api/client";

export function useSecureFileUrl(url: string) {
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    let localUrl: string | null = null;

    async function fetchSecureFile() {
      try {
        setLoading(true);
        // Uses apiClient to automatically attach the Bearer token
        const blob = await GET<Blob>(url, { responseType: "blob" });
        localUrl = URL.createObjectURL(blob);
        if (isMounted) {
          setObjectUrl(localUrl);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
        void error;
      }
    }

    fetchSecureFile();

    return () => {
      isMounted = false;
      if (localUrl) URL.revokeObjectURL(localUrl);
    };
  }, [url]);

  return { objectUrl, loading, error };
}
