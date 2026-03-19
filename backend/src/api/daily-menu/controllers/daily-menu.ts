/**
 * daily-menu controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::daily-menu.daily-menu",
  ({ strapi }) => ({
    async obtenerPostres(ctx) {
      try {
        const total = await strapi
          .service("api::daily-menu.daily-menu")
          .devolverPostresSinRepetir();

        return ctx.send({ data: total });
      } catch (error) {
        ctx.throw(500, "Hubo un problema al buscar los postres", error);
      }
    },

    async find(ctx) {
      try {
        const { min_precio, max_precio, excluir_alergenos } = ctx.query;
        ctx.query.filters = (ctx.query.filters as object) || {};

        if (min_precio || max_precio) {
          ctx.query.filters["suma"] = {
            ...(min_precio ? { $gte: Number(min_precio) } : {}),
            ...(max_precio ? { $lte: Number(max_precio) } : {}),
          };
        }

        if (excluir_alergenos) {
          const listaAlergenos = (excluir_alergenos as string).split(",");
          ctx.query.filters["$and"] = [
            { primero: { allergens: { lactosa: { $notIn: listaAlergenos } } } },
            { segundo: { allergens: { lactosa: { $notIn: listaAlergenos } } } },
            { postre: { allergens: { lactosa: { $notIn: listaAlergenos } } } },
          ];
        }

        const { data, meta } = await super.find(ctx);
        return { data, meta };
      } catch (error) {
        ctx.throw(500, "Hubo un problema al filtrar los menús", error);
      }
    },
  }),
);
