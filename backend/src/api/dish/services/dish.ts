import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::dish.dish", ({ strapi }) => ({
  async calcularTopPopulares() {
    const menus = await strapi.db.query("api::daily-menu.daily-menu").findMany({
      populate: ["primero", "segundo", "postre"],
    });

    const contador = {};

    menus.forEach((menu: any) => {
      [menu.primero, menu.segundo, menu.postre].forEach((plato) => {
        if (plato && plato.id) {
          const id = plato.id;
          contador[id] = (contador[id] || 0) + 1;
        }
      });
    });

    //ordernar de mayor a menor
    const rankingIds = Object.keys(contador)
      .sort((a, b) => contador[b] - contador[a])
      .slice(0, 3); // Cogemos solo el Top 3

    // 4. Buscamos los datos completos de esos 3 platos para devolverlos
    const platosPopulares = await strapi.db.query("api::dish.dish").findMany({
      where: { id: { $in: rankingIds } },
    });

    //  AÑADIMOS EL NUMERO DE VECES QUE HA Sido elegido el palto
    return platosPopulares
      .map((plato) => ({
        ...plato,
        veces_elegido: contador[plato.id],
      }))
      .sort((a, b) => b.veces_elegido - a.veces_elegido);
  },
}));
