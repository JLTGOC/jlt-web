import { UnstyledButton } from "@mantine/core";
import classes from "./StepperBar.module.css";

const DEFAULT_STEP_LABELS = [
  "QUOTATION DETAILS",
  "BILLING DETAILS",
  "TERMS AND CONDITION/CLOSING STATEMENT",
] as const;

interface StepperBarProps {
  step: number;
  onStepClick: (index: number) => void;
  labels?: readonly string[];
}

export function StepperBar({ step, onStepClick, labels }: StepperBarProps) {
  const stepLabels = labels ?? DEFAULT_STEP_LABELS;
  return (
    <div className={classes.root}>
      {stepLabels.map((label, index) => {
        const isPast = index < step;
        const isActiveOrCompleted = index <= step;

        return (
          <UnstyledButton
            key={label}
            type="button"
            className={`${classes.tab} ${isActiveOrCompleted ? classes.active : classes.future} ${isPast ? classes.clickable : ""}`}
            onClick={() => {
              if (isPast) onStepClick(index);
            }}
          >
            {label}
          </UnstyledButton>
        );
      })}
    </div>
  );
}
