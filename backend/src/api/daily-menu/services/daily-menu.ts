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
    async devolverPostresSinRepetir() {
      // 1. Consultar todos los menús y poblar SOLO la relación del postre
      const menus = await strapi.entityService.findMany(
        "api::daily-menu.daily-menu",
        {
          populate: {
            postre: true,
          },
        },
      );

      // Si no hay menús creados, devolvemos un array vacío para evitar errores
      if (!menus || menus.length === 0) {
        return [];
      }

      // 2. Extraer los postres y descartar los menús que se hayan guardado sin postre (null/undefined)
      const postresCrudos = menus
        .map((menu) => menu.postre)
        .filter((postre) => postre !== null && postre !== undefined);

      // 3. Eliminar los duplicados.
      // Usamos un Map de JavaScript usando el 'id' del plato como clave única.
      // Si dos menús tienen el postre con ID 8, el Map sobrescribe el primero y solo guarda uno.
      const mapaPostresUnicos = new Map();

      postresCrudos.forEach((postre) => {
        // TypeScript podría quejarse si no tipamos, pero en JS puro/Strapi esto funciona directo
        mapaPostresUnicos.set(postre.id, postre);
      });

      // 4. Convertir los valores del Map de vuelta a un Array limpio
      const postresUnicos = Array.from(mapaPostresUnicos.values());

      return postresUnicos;
    },
  }),
);
