import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    //badge es un icono que se le puede poner ala opcion de menu
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
  {
    "_tag": "CSidebarNavDropdown",
    name: 'SISTEMA',    
    icon: 'cil-people',
    //_children es submenu de optiones
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Usuarios',
        to: '/users',        
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Roles',
        to: '/roles',        
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Modulos',
        to: '/modules',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Opciones de Menu',
        to: '/menuOptions',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Permisos',
        to: '/permissions',
      },
    ],
  },
  {
    "_tag": "CSidebarNavDropdown",
    name: 'LINKS',
    icon: 'cilBookmark',
    //_children es submenu de optiones
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Idiomas',
        to: '/languages',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Categorias de peliculas',
        to: '/movieCategories',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Actores',
        to: '/actors',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Links',
        to: '/movies',
      },
    ],
  },
  {
    "_tag": "CSidebarNavDropdown",
    name: 'FIFA',
    icon: 'cilStar',
    //_children es submenu de optiones
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Paises',
        to: '/countries',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Ligas',
        to: '/leagues',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Equipos',
        to: '/leagueTeams',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Posiciones de Jugadores',
        to: '/playerPositions',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Zonas de Jugadores',
        to: '/playerZones',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Versiones de Jugadores',
        to: '/playerVersions',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Jugadores',
        to: '/players',
      },
    ],
  },  
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Components']
  },
  {
    "_tag": "CSidebarNavDropdown",
    name: 'Bases',
    route: '/base',
    icon: 'cil-puzzle',
    //_children es submenu de optiones
    _children: [      
      {
        _tag: 'CSidebarNavItem',
        name: 'Cards',
        to: '/base/cards',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Forms',
        to: '/base/forms',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Jumbotron',
        to: '/base/jumbotrons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Navs',
        to: '/base/navs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Progress',
        to: '/base/progress-bar',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Switches',
        to: '/base/switches',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tables',
        to: '/base/tables',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tabs',
        to: '/base/tabs',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Buttons',
    route: '/buttons',
    icon: 'cil-cursor',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Brand buttons',
        to: '/buttons/brand-buttons',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Dropdowns',
        to: '/buttons/button-dropdowns',
      }
    ],
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Charts',
    to: '/charts',
    icon: 'cil-chart-pie'
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Icons',
    route: '/icons',
    icon: 'cil-star',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    _tag: 'CSidebarNavDropdown',
    name: 'Notifications',
    route: '/notifications',
    icon: 'cil-bell',
    _children: [
      {
        _tag: 'CSidebarNavItem',
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Toaster',
        to: '/notifications/toaster'
      }
    ]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Widgets',
    to: '/widgets',
    icon: 'cil-calculator',
    badge: {
      color: 'info',
      text: 'NEW',
    },
  }  
]

export default _nav
