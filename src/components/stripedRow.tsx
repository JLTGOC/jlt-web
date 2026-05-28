import type React from "react";

/**
 * Returns row props that apply local zebra striping to table rows.
 * - index: 0-based row index
 * - extra: optional existing row props to merge (styles are merged; extra.style wins except for backgroundColor which is set by this helper)
 */
export function stripedRowProps(
  index: number,
  extra?: React.HTMLAttributes<HTMLTableRowElement>,
): React.HTMLAttributes<HTMLTableRowElement> {
  const isEven = index % 2 === 1; // visual even rows (2nd, 4th,...)
  const backgroundColor = isEven ? "#F1F3F4" : "#ffffff";

  const mergedStyle: React.CSSProperties = {
    ...(extra?.style ?? {}),
    backgroundColor,
  };

  return {
    ...(extra ?? {}),
    style: mergedStyle,
  };
}

export default stripedRowProps;
