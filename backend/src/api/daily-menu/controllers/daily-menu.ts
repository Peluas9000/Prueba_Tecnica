/**
 * daily-menu controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::daily-menu.daily-menu",
  (strapi) => ({
    async find(ctx) {
      try {
        const total = await strapi
          .services("api::daily-menu.daily-menu")
          .devolverPostresSinRepetir();
      } catch (error) {}
    },
  }),
);
