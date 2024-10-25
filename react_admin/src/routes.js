import React from 'react';

const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
const Tables = React.lazy(() => import('./views/base/tables/Tables'));

const Cards = React.lazy(() => import('./views/base/cards/Cards'));
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
const Navs = React.lazy(() => import('./views/base/navs/Navs'));
const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
const Switches = React.lazy(() => import('./views/base/switches/Switches'));

const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
const Charts = React.lazy(() => import('./views/charts/Charts'));
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Widgets = React.lazy(() => import('./views/widgets/Widgets'));

const Users = React.lazy(() => import('./views/pages/users/usersScreen'));
const User = React.lazy(() => import('./views/pages/users/userScreen'));
const Roles = React.lazy(() => import('./views/pages/roles/rolesScreen'));
const Role = React.lazy(() => import('./views/pages/roles/roleScreen'));
const Modules = React.lazy(() => import('./views/pages/modules/modulesScreen'));
const Module = React.lazy(() => import('./views/pages/modules/moduleScreen'));
const MenuOptions = React.lazy(() => import('./views/pages/menuOptions/menuOptionsScreen'));
const MenuOption = React.lazy(() => import('./views/pages/menuOptions/menuOptionScreen'));
const Permissions = React.lazy(() => import('./views/pages/permissions/permissionsScreen'));
const Permission = React.lazy(() => import('./views/pages/permissions/permissionScreen'));

const Languages = React.lazy(() => import('./views/pages/links/languages/languagesScreen'));
const Language = React.lazy(() => import('./views/pages/links/languages/languageScreen'));
const MovieCategories = React.lazy(() => import('./views/pages/links/movieCategories/movieCategoriesScreen'));
const MovieCategory = React.lazy(() => import('./views/pages/links/movieCategories/movieCategoryScreen'));
const Actors = React.lazy(() => import('./views/pages/links/actors/actorsScreen'));
const Actor = React.lazy(() => import('./views/pages/links/actors/actorScreen'));
const Movies = React.lazy(() => import('./views/pages/links/movie/moviesScreen'));
const Movie = React.lazy(() => import('./views/pages/links/movie/movieScreen'));

const Countries = React.lazy(() => import('./views/pages/fifa/countries/countriesScreen'));
const Country = React.lazy(() => import('./views/pages/fifa/countries/countryScreen'));
const Leagues = React.lazy(() => import('./views/pages/fifa/leagues/leaguesScreen'));
const League = React.lazy(() => import('./views/pages/fifa/leagues/leagueScreen'));
const PlayerPositions = React.lazy(() => import('./views/pages/fifa/playerPositions/playerPositionsScreen'));
const PlayerPosition = React.lazy(() => import('./views/pages/fifa/playerPositions/playerPositionScreen'));
const PlayerVersions = React.lazy(() => import('./views/pages/fifa/playerVersions/playerVersionsScreen'));
const PlayerVersion = React.lazy(() => import('./views/pages/fifa/playerVersions/playerVersionScreen'));
const PlayerZones = React.lazy(() => import('./views/pages/fifa/playerZones/playerZonesScreen'));
const PlayerZone = React.lazy(() => import('./views/pages/fifa/playerZones/playerZoneScreen'));
const LeagueTeams = React.lazy(() => import('./views/pages/fifa/leagueTeams/leagueTeams'));
const LeagueTeam = React.lazy(() => import('./views/pages/fifa/leagueTeams/leagueTeam'));
const Players = React.lazy(() => import('./views/pages/fifa/players/playersScreen'));
const Player = React.lazy(() => import('./views/pages/fifa/players/playerScreen'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/base', name: 'Base', component: Cards, exact: true },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/forms', name: 'Forms', component: BasicForms },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/brands', name: 'Brands', component: Brands },
  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  
  { path: '/users', exact: true,  name: 'Usuarios', component: Users },
  { path: '/user/:id', exact: true, name: 'Usuario', component: User },
  { path: '/roles', exact: true,  name: 'Roles', component: Roles },
  { path: '/role/:id', exact: true,  name: 'Rol', component: Role },
  { path: '/modules', exact: true,  name: 'Modulos', component: Modules },
  { path: '/module/:id', exact: true,  name: 'Modulo', component: Module },
  { path: '/menuOptions', exact: true,  name: 'Opciones de Menu', component: MenuOptions },
  { path: '/MenuOption/:id', exact: true,  name: 'Opcion de Menu', component: MenuOption },
  { path: '/permissions', exact: true,  name: 'Permisos', component: Permissions },
  { path: '/permission/:id', exact: true,  name: 'Permiso', component: Permission },

  { path: '/languages', exact: true,  name: 'Idiomas', component: Languages },
  { path: '/language/:id', exact: true,  name: 'Idioma', component: Language },
  { path: '/movieCategories', exact: true,  name: 'Categorias de Peliculas', component: MovieCategories },
  { path: '/movieCategory/:id', exact: true,  name: 'Categoria de Pelicula', component: MovieCategory },
  { path: '/actors', exact: true,  name: 'Actores', component: Actors },
  { path: '/actor/:id', exact: true,  name: 'Actor', component: Actor },
  { path: '/movies', exact: true,  name: 'Links', component: Movies },
  { path: '/movie/:id', exact: true,  name: 'Link', component: Movie },

  { path: '/countries', exact: true,  name: 'Paises', component: Countries },
  { path: '/country/:id', exact: true,  name: 'Pais', component: Country },
  { path: '/leagues', exact: true,  name: 'Ligas', component: Leagues },
  { path: '/league/:id', exact: true,  name: 'Liga', component: League },
  { path: '/playerPositions', exact: true,  name: 'Posiciones de jugador', component: PlayerPositions },
  { path: '/playerPosition/:id', exact: true,  name: 'Posicion de jugador', component: PlayerPosition },
  { path: '/playerVersions', exact: true,  name: 'Versiones de jugador', component: PlayerVersions },
  { path: '/playerVersion/:id', exact: true,  name: 'Version de jugador', component: PlayerVersion },
  { path: '/playerZones', exact: true,  name: 'Zonas', component: PlayerZones },
  { path: '/playerZone/:id', exact: true,  name: 'Zona', component: PlayerZone },
  { path: '/leagueTeams', exact: true,  name: 'Equipos', component: LeagueTeams },
  { path: '/leagueTeam/:id', exact: true,  name: 'Equipo', component: LeagueTeam },
  { path: '/players', exact: true,  name: 'Jugadores', component: Players },
  { path: '/player/:id', exact: true,  name: 'Jugador', component: Player },
];

export default routes;
