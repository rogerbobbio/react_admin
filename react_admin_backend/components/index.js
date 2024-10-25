/*
RUTA: /api/mysql
*/

const router = require('express').Router();

// Test MySQL DB
router.use('/', require('./root/root.api'));
// Users
router.use('/users', require('./user/user.api'));
// Login
router.use('/login', require('./login/login.api'));
// Upload files
router.use('/uploads', require('./uploads/uploads.api'));
// User Roles
router.use('/userRoles', require('./userRole/userRole.api'));
// modules
router.use('/modules', require('./systemModule/systemModule.api'));
// screens
router.use('/screens', require('./systemScreen/systemScreen.api'));
// permissions
router.use('/permissions', require('./systemPermission/systemPermission.api'));
// systemConfig
router.use('/systemConfig', require('./systemConfig/systemConfig.api'));


//LINKS =========================================================
// languages
router.use('/languages', require('./links/language/language.api'));
// actors
router.use('/actors', require('./links/actor/actor.api'));
// categories
router.use('/movieCategories', require('./links/movieCategory/movieCategory.api'));
// movies
router.use('/movies', require('./links/movie/movie.api'));

//FIFA =========================================================
// countries
router.use('/countries', require('./fifa/country/country.api'));
// leagues
router.use('/leagues', require('./fifa/league/league.api'));
// playerPositions
router.use('/playerPositions', require('./fifa/player_position/playerPosition.api'));
// playerVersions
router.use('/playerVersions', require('./fifa/player_version/playerVersion.api'));
// playerZones
router.use('/playerZones', require('./fifa/player_zone/playerZone.api'));
// leagueTeams
router.use('/leagueTeams', require('./fifa/league_team/leagueTeam.api'));
// players
router.use('/players', require('./fifa/player/player.api'));

module.exports = router