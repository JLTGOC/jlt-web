import {
  UnstyledButton,
  type UnstyledButtonProps,
  Loader,
} from "@mantine/core";
import type { ComponentType, ReactNode, SVGProps } from "react";
import classes from "./AppButton.module.css";

type AppButtonVariant = "primary" | "glass";

/**
 * Preset widths. Omit `size` entirely to keep the button's intrinsic,
 * content-driven width — this is what every existing `variant="primary"`
 * call site relies on today, so leaving `size` unset never changes them.
 */
type AppButtonSize = "sm" | "md" | "lg" | "xl" | "full";

const SIZE_CLASSNAMES: Record<AppButtonSize, string> = {
  sm: classes.sizeSm,
  md: classes.sizeMd,
  lg: classes.sizeLg,
  xl: classes.sizeXl,
  full: classes.sizeFull,
};

interface AppButtonProps extends UnstyledButtonProps {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  form?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

export function AppButton({
  variant = "primary",
  size,
  className,
  loading,
  disabled,
  children,
  icon: BadgeIcon,
  ...rest
}: AppButtonProps) {
  const ResolvedIcon = BadgeIcon;
  const isGlass = variant === "glass";
  const sizeClassName = size ? SIZE_CLASSNAMES[size] : "";

  return (
    <UnstyledButton
      className={`${classes.root} ${classes[variant]} ${sizeClassName} ${className ?? ""}`}
      disabled={disabled || loading}
      {...rest}
    >
      <span className={classes.label}>{children}</span>

      {ResolvedIcon && (
        <span className={isGlass ? classes.iconGlass : classes.orangeBadge}>
          {loading ? (
            <Loader
              size={isGlass ? "0.875rem" : "1rem"}
              color={isGlass ? "#ffffff" : "#1e2d45"}
            />
          ) : (
            <ResolvedIcon
              width={isGlass ? "1.125rem" : "1.25rem"}
              height={isGlass ? "1.125rem" : "1.25rem"}
            />
          )}
        </span>
      )}
    </UnstyledButton>
  );
}
