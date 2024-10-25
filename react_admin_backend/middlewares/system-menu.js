const getMenu = (role) => {

    const menu = [
        {
            titulo: 'Personal',
            icono: 'fas fa-user-cog mr-2 lead',
            submenu:[
              { titulo: 'Mi Perfil', url: 'profile'},
              { titulo: 'Configuracion', url: 'account-settings'},
              { titulo: 'Cerrar Session', url: ''}
            ]
          },
          {
            titulo: 'Seguridad',
            icono: 'fas fa-shield-alt mr-2 lead',
            submenu:[
              { titulo: 'Usuarios', url: 'users'},
              { titulo: 'Roles', url: 'roles'},
              { titulo: 'Modulos', url: 'modules'},
              { titulo: 'Opciones de Menu', url: 'options'},
            ]
          },
          {
            titulo: 'Links',
            icono: 'fas fa-link mr-2 lead',
            submenu:[
              { titulo: 'Links', url: 'links'},
              { titulo: 'Categorias de links', url: 'movieCategories'},
              { titulo: 'Actores', url: 'actors'},
              { titulo: 'Idiomas', url: 'languajes'},
            ]
          }
    ];

    return menu;

}

module.exports = {
    getMenu
}