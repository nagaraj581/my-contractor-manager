import type { IconType } from "react-icons";

export interface MenuItem {
  title: string;
  path?: string;
  icon?: IconType;
  children?: MenuItem[];
}