/**
 * dish controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::dish.dish",
  ({ strapi }) => ({
    async obtenerPopulares(ctx) {
      try {
        // Llamamos al método de nuestro servicio
        const data = await strapi
          .service("api::dish.dish")
          .calcularTopPopulares();

        return { data };
      } catch (error) {
        ctx.throw(500, "Error al calcular el ranking de platos", error);
      }
    },
  }),
);
