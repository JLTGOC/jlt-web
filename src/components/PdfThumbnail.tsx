import { Box, Text } from "@mantine/core";
import { PictureAsPdf } from "@nine-thirty-five/material-symbols-react/rounded";
import { useEffect, useRef, useState } from "react";
import { GET } from "@/lib/api/client";

interface PdfThumbnailProps {
  url: string;
}

export function PdfThumbnail({ url }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let createdObjectUrl: string | null = null;

    async function render() {
      try {
        const pdfjsLib = await import("pdfjs-dist");

        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        // If the URL is already a blob URL or data URL we can skip fetching it again.
        const isBlobLike = url.startsWith("blob:") || url.startsWith("data:");

        let sourceUrl = url;

        if (!isBlobLike) {
          const blob = await GET<Blob>(url, { responseType: "blob" });
          createdObjectUrl = URL.createObjectURL(blob);
          sourceUrl = createdObjectUrl;
        }

        if (cancelled) return;

        const pdf = await pdfjsLib.getDocument(sourceUrl).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = canvas.parentElement?.clientWidth ?? 150;

        // Scale to fill width, let height overflow (cropped by container)
        const scale = containerWidth / viewport.width;
        const scaled = page.getViewport({ scale });

        canvas.width = scaled.width;
        canvas.height = scaled.height;

        await page.render({
          canvasContext: canvas.getContext("2d")!,
          viewport: scaled,
          canvas: canvas,
        }).promise;

        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error("Failed to render PDF thumbnail:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    render();

    return () => {
      cancelled = true;
      if (createdObjectUrl) URL.revokeObjectURL(createdObjectUrl);
    };
  }, [url]);

  if (error) {
    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          gap: "0.4rem",
        }}
      >
        <PictureAsPdf
          width={32}
          height={32}
          style={{ color: "var(--mantine-color-red-6)" }}
        />
        <Text size="0.6rem" c="dimmed" tt="uppercase" lts="0.05em">
          PDF
        </Text>
      </Box>
    );
  }

  return (
    <Box style={{ position: "relative", width: "100%", height: "100%" }}>
      {loading && (
        <Box
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "var(--mantine-color-gray-2)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          display: "block",
          opacity: loading ? 0 : 1,
          transition: "opacity 200ms ease",
          verticalAlign: "top",
        }}
      />
    </Box>
  );
}
