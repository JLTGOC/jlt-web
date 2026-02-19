import Cancel from "./cancel.svg";
import Delivered from "./delivered.svg";
import Ongoing from "./ongoing.svg";
import Quotations from "./quotations.svg";
import Services from "./services.svg";
import Template from "./template.svg";

export const Icons = {
  Cancel,
  Delivered,
  Ongoing,
  Quotations,
  Services,
  Template,
} as const;

export type IconName = keyof typeof Icons;
