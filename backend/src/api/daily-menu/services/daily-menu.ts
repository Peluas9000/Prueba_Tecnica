import { factories } from "@strapi/strapi";
interface Plato {
  id: number;
  name: string;
  price: number;
  
}

interface Menu {
  id: number;
  postre?: Plato | null;
}
export default factories.createCoreService(
  "api::daily-menu.daily-menu",
  ({ strapi }) => ({
    async calcularIvaPlato(identificador: any) {
      // 1. Si no hay ID, devolvemos 0
      if (!identificador) return 0;

     
      const plato = await strapi.documents("api::dish.dish").findOne({
       documentId: identificador,
      });


      // Si no encuentra el plato o no tiene precio, suma 0
      if (!plato || !plato.price) return 0;

      let porcentajeIva = 0;

      
      if (plato.type === "Primero" || plato.type === "Segundo ") {
        porcentajeIva = 0.1;
      } else if (plato.type === "Postre") {
        porcentajeIva = 0.21;
      }else if(plato.type==="Segundo "){
        porcentajeIva = 0.1;
      } else {
        porcentajeIva = 0.1;
      }

      return plato.price + plato.price * porcentajeIva;
    },
    async devolverPostresSinRepetir() {
      // 1. Consultar todos los menús y poblar SOLO la relación del postre
      const menus = (await strapi.documents("api::daily-menu.daily-menu").findMany({
          populate: {
              postre: true,
            },
          
      }  ));

      // Si no hay menús creados, devolvemos un array vacío
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
