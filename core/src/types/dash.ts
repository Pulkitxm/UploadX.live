import { JSX } from "react";
import { IconType } from "react-icons/lib";

export type SIDEBAR_MENU_ITEM_TYPE = (
  | {
      type: "ICON";
      icon: IconType;
      label: string;
    }
  | {
      type: "COMPONENT";
      component: () => JSX.Element;
    }
) & {
  position: "top" | "bottom";
  href?: string;
};
