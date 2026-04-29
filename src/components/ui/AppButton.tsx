import {
  UnstyledButton,
  type UnstyledButtonProps,
  Loader,
} from "@mantine/core";
import type { ComponentType } from "react";
import classes from "./AppButton.module.css";
import { ArrowRightAlt } from "@nine-thirty-five/material-symbols-react/outlined";

type AppButtonVariant = "primary";

interface AppButtonProps extends UnstyledButtonProps {
  variant?: AppButtonVariant;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  form?: string;
  icon?: ComponentType<{ width?: number | string; height?: number | string }>;
}

export function AppButton({
  variant = "primary",
  className,
  loading,
  disabled,
  children,
  icon: BadgeIcon,
  ...rest
}: AppButtonProps) {
  const ResolvedIcon = BadgeIcon ?? ArrowRightAlt;

  return (
    <UnstyledButton
      className={`${classes.root} ${classes[variant]} ${className ?? ""}`}
      disabled={disabled || loading}
      {...rest}
    >
      <span className={classes.label}>{children}</span>

      {ResolvedIcon && (
        <span className={classes.orangeBadge}>
          {loading ? (
            <Loader size="1rem" color="#1e2d45" />
          ) : (
            <ResolvedIcon width="1.25rem" height="1.25rem" />
          )}
        </span>
      )}
    </UnstyledButton>
  );
}
