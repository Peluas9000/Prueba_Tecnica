import { errors } from "@strapi/utils";

function extraerIdReal(datoRelacion: any, idAntiguo: any = null) {
  if (!datoRelacion) return idAntiguo;
  if (typeof datoRelacion === "number" || typeof datoRelacion === "string")
    return datoRelacion;

  if (datoRelacion.connect && datoRelacion.connect.length > 0) {
    return datoRelacion.connect[0].documentId || datoRelacion.connect[0].id;
  }


  if (datoRelacion.connect && datoRelacion.connect.length === 0) {
    return idAntiguo;
  }

  return null;
}

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    const idPrimero = extraerIdReal(data.primero);
    const idSegundo = extraerIdReal(data.segundo);
    const idPostre = extraerIdReal(data.postre);

    if (
      (idPrimero && idPrimero === idSegundo) ||
      (idPrimero && idPrimero === idPostre) ||
      (idSegundo && idSegundo === idPostre)
    ) {
      throw new errors.ApplicationError(
        "Los platos deben ser diferentes entre sí",
      );
    }

    const p1Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(idPrimero);
    const p2Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(idSegundo);
    const p3Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(idPostre);

    data.suma = p1Price + p2Price + p3Price;
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    const menuActual: any = await strapi.db
      .query("api::daily-menu.daily-menu")
      .findOne({
        where: where,
        populate: ["primero", "segundo", "postre"],
      });

    // Pasamos tanto el documentId como el id normal por seguridad
    const idPrimero = extraerIdReal(
      data.primero,
      menuActual?.primero?.documentId || menuActual?.primero?.id,
    );
    const idSegundo = extraerIdReal(
      data.segundo,
      menuActual?.segundo?.documentId || menuActual?.segundo?.id,
    );
    const idPostre = extraerIdReal(
      data.postre,
      menuActual?.postre?.documentId || menuActual?.postre?.id,
    );

    if (
      (idPrimero && idPrimero === idSegundo) ||
      (idPrimero && idPrimero === idPostre) ||
      (idSegundo && idSegundo === idPostre)
    ) {
      throw new errors.ApplicationError(
        "Los platos deben ser diferentes entre sí",
      );
    }

    const p1Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(idPrimero);
    const p2Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(idSegundo);
    const p3Price = await strapi
      .service("api::daily-menu.daily-menu")
      .calcularIvaPlato(idPostre);

    data.suma = p1Price + p2Price + p3Price;
  },
};
