import { errors } from "@strapi/utils";
import { ApplicationError } from "@strapi/utils/dist/errors";

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (
      data.primero === data.segundo ||
      data.primero === data.postre ||
      data.segundo === data.postre
    )
      throw new errors.ApplicationError(
        "Los platos deben ser diferentes entre sí",
      );

    //busqueda de los platos para calcular la suma de sus precios y guardarla en el campo suma del menú diario
    const plato1 = await strapi.db.query("api::dish.dish").findOne({
      where: { id: data.primero },
    });

    const plato2 = await strapi.db.query("api::dish.dish").findOne({
      where: { id: data.segundo },
    });

    const plato3 = await strapi.db.query("api::dish.dish").findOne({
      where: { id: data.postre },
    });

    //los precios de los platos con el iva aplicado
    const plato1Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(plato1.id);
    const plato2Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(plato2.id);
    const plato3Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(plato3.id);

    data.suma = plato1Price + plato2Price + plato3Price;
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    if (
      data.primero === data.segundo ||
      data.primero === data.postre ||
      data.segundo === data.postre
    )
      throw new errors.ApplicationError(
        "Los platos deben ser diferentes entre sí",
      );

    const plato1 = await strapi.db.query("api::dish.dish").findOne({
      where: { id: data.primero },
    });

    const plato2 = await strapi.db.query("api::dish.dish").findOne({
      where: { id: data.segundo },
    });

    const plato3 = await strapi.db.query("api::dish.dish").findOne({
      where: { id: data.postre },
    });

    data.suma = plato1.price + plato2.price + plato3.price;
  },
};
