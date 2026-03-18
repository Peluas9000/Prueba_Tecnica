/**
 * daily-menu router
 */

import { factories } from "@strapi/strapi";
import { METHODS } from "http";
import path from "path";

export default {
  routes: [
    {
      method: "GET",
      path: "/daily-menu",
      handler: "daily-menu.find",
      config: {
        auth: false,
      },
    },
  ],
};
