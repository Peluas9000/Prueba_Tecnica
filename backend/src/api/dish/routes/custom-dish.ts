export default {
  routes: [
    {
      method: "GET",
      path: "/platos/populares",
      handler: "dish.obtenerPopulares",
      config: {
        auth: true, //utilizo token de solo lectura en el archivo raiz api.rest con  la extension REST CLIENTE EN VSCODE
      },
    },
  ],
};
