import Cancel from "./cancel.svg";
import Delivered from "./delivered.svg";
import Ongoing from "./ongoing.svg";
import Quotations from "./quotations.svg";
import Services from "./services.svg";
import Template from "./template.svg";
import ETA_air from "./ETA_air.svg";
import ETD_air from "./ETD_air.svg";

export const Icons = {
  Cancel,
  Delivered,
  Ongoing,
  Quotations,
  Services,
  Template,
  ETA_air,
  ETD_air,
} as const;

export type IconName = keyof typeof Icons;
