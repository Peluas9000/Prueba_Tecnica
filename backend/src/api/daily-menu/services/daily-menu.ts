import { factories } from "@strapi/strapi";
interface Plato {
  id: number;
  name: string;
  price: number;
  // Puedes añadir más campos si los necesitas
}

interface Menu {
  id: number;
  postre?: Plato | null; // Le decimos que el menú puede tener un objeto Plato, o venir vacío
}
export default factories.createCoreService(
  "api::daily-menu.daily-menu",
  ({ strapi }) => ({
    async calcularIvaPlato(identificador: any) {
      // 1. Si no hay ID, devolvemos 0
      if (!identificador) return 0;

      // 2. Usamos db.query SIEMPRE. Es ciego al Draft/Publish y nunca falla.
      const plato: any = await strapi.db.query("api::dish.dish").findOne({
        where:
          typeof identificador === "string"
            ? { documentId: identificador }
            : { id: identificador },
      });

      // Si no encuentra el plato o no tiene precio, suma 0
      if (!plato || !plato.price) return 0;

      let porcentajeIva = 0;

      // 3. Calculamos el impuesto
      if (plato.type === "Primero" || plato.type === "Segundo") {
        porcentajeIva = 0.1;
      } else if (plato.type === "Postre") {
        porcentajeIva = 0.21;
      } else {
        porcentajeIva = 0.1;
      }

      return plato.price + plato.price * porcentajeIva;
    },
    async devolverPostresSinRepetir() {
      // 1. Consultar todos los menús y poblar SOLO la relación del postre
      const menus = (await strapi.entityService.findMany(
        "api::daily-menu.daily-menu",
        {
          populate: {
            postre: true,
          },
        },
      )) as Menu[];

      // Si no hay menús creados, devolvemos un array vacío para evitar errores
      if (!menus || menus.length === 0) {
        return [];
      }

      // 2. Extraer los postres y descartar los menús que se hayan guardado sin postre (null/undefined)
      const postresCrudos = menus
        .map((dailyMenu) => dailyMenu.postre)
        .filter((postre) => postre !== null && postre !== undefined);

      // 3. Eliminar los duplicados.
      // Usamos un Map de JavaScript usando el 'id' del plato como clave única.
      // Si dos menús tienen el postre con ID 8, el Map sobrescribe el primero y solo guarda uno.
      const mapaPostresUnicos = new Map();

      postresCrudos.forEach((postre) => {
        mapaPostresUnicos.set(postre.id, postre);
      });

      // 4. Convertir los valores del Map de vuelta a un Array limpio
      const postresUnicos = Array.from(mapaPostresUnicos.values());

      return postresUnicos;
    },
  }),
);
