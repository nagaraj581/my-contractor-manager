import {
  FaHome,
  FaUsers,
  FaFileInvoice,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";

import type { MenuItem } from "../models/MenuItem";

export const sidebarMenu: MenuItem[] = [

  {
    title: "Dashboard",
    icon: FaHome,
    path: "/",
  },

  {
    title: "CRM",
    children: [
      {
        title: "Customers",
        icon: FaUsers,
        path: "/customers",
      },
    ],
  },

  {
    title: "Sales",
    children: [
      {
        title: "Quotations",
        icon: FaFileInvoice,
        path: "/quotations",
      },
    ],
  },

  {
    title: "Projects",
    icon: FaProjectDiagram,
    path: "/projects",
  },

  {
    title: "Masters",
    children: [
      {
        title: "Rate Card",
        icon: FaMoneyBillWave,
        path: "/rate-card",
      },
    ],
  },

  {
    title: "Settings",
    icon: FaCog,
    path: "/settings",
  },

];