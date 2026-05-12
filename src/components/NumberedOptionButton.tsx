import { type ReactNode } from "react";
import { UnstyledButton } from "@mantine/core";
import classes from "./NumberedOptionButton.module.css";

export interface NumberedOptionButtonProps {
  number: number;
  label: string;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export function NumberedOptionButton({
  number,
  label,
  onClick,
  className,
  children,
}: NumberedOptionButtonProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      className={`${classes.button}${className ? ` ${className}` : ""}`}
      tabIndex={0}
      bdrs={"md"}
    >
      <span className={classes.number}>{number}</span>
      <span className={classes.label}>{label}</span>
      {children}
    </UnstyledButton>
  );
}
