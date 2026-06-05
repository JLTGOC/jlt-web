import { Box, Text } from "@mantine/core";

interface AddCompanyStepperProps {
  steps: string[];
  activeStep: number;
}

export function AddCompanyStepper({ steps, activeStep }: AddCompanyStepperProps) {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "1rem",
        marginBottom: "0.5rem",
        width: "100%",
      }}
    >
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= activeStep;
        const isLineActive = stepNumber < activeStep;

        return (
          <Box
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              minWidth: 0,
              position: "relative",
            }}
          >
            <Box
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: isActive ? "#0064E0" : "#dee2e6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Text c="white" size="sm">
                {stepNumber}
              </Text>
            </Box>

            <Text
              size="sm"
              fw={300}
              c="black"
              style={{
                whiteSpace: "pre-line",
                marginTop: 6,
                textAlign: "center",
                minWidth: 0,
              }}
            >
              {label}
            </Text>

            {index < steps.length - 1 ? (
              <Box
                style={{
                  position: "absolute",
                  top: "35%",
                  left: "50%",
                  right: -16,
                  height: 2,
                  backgroundColor: isLineActive ? "#0064E0" : "#adb5bd",
                  transform: "translateY(-50%)",
                  zIndex: 0,
                }}
              />
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
}
