import { Box } from "@mantine/core";

import image from "./under-construction.jpg"
export function PlanningTimelineUnderConstruction() {
  return (
    <Box
      style={{
        width: "100%",
        minHeight: "calc(100vh - 60px)",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={image}
        alt="Website under construction"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: 1200,
          maxHeight: "80vh",
          objectFit: "contain",
        }}
      />
    </Box>
  );
}
