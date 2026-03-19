export default {
  routes: [
    {
      method: "GET",
      path: "/menus/postres",
      handler: "daily-menu.obtenerPostres", // Conecta con el método que ya tienes en tu controlador
      config: {
        auth: false, // Descomenta esta línea si quieres probar en Postman sin necesitar un token (solo para desarrollo)
      },
    },
  ],
};
