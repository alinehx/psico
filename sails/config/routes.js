/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/
  '/*' : 'SessionController.disable',  
  
  'get /login/:email&:password': 'AuthController.login',
  'post /user': 'UserController.create',
  'get /address/:zipCode': 'AddressController.getAddress',

  'delete /user/:email': 'UserController.disable',
  'put /user/:email': 'UserController.update',
  'get /user': 'UserController.getAll',
  'get /user/:email': 'UserController.getUser',

  'post /member': 'MemberController.create',
  'delete /member/:email': 'MemberController.disable',
  'put /member/:email': 'MemberController.update',
  'get /member': 'MemberController.getAll',
  'get /member/:email': 'MemberController.getMember',

  'post /class': 'ClassController.create',
  'put /class/:name&:location': 'ClassController.update',
  'delete /class/:name&:location': 'ClassController.disable',
  'get /class/:name&:location': 'ClassController.getClass',
  'get /class': 'ClassController.getAll',
  'get /class/u/:room': 'ClassController.getOne',

  'post /constants': 'ConstantsController.createConstant',
  'get /constants': 'ConstantsController.getAll',
  'get /constants/:constantType': 'ConstantsController.getByType',
  'get /constants/:constantValue': 'ConstantsController.getValue',
  'put /constants': 'ConstantsController.updateConstant',

  'post /hours': 'HourController.createHour',
  'get /hours': 'HourController.getAll',
  'get /hours/:date&:room': 'HourController.getByRoomDate',
  'get /hours/s/:date&:room': 'HourController.getByDateRange',
  'get /hours/a/:availability': 'HourController.getByAvailability',
  'get /hours/u/:agenda': 'HourController.getByAgenda',
  'put /hours/:id': 'HourController.updateHour',

  'post /agenda': 'AgendaController.createAgenda',
  'put /agenda/:id': 'AgendaController.updateAgenda',
  'get /agenda/:email': 'AgendaController.getAgendaByResponsable',
  'get /agenda': 'AgendaController.getAll',
  'get /agenda/a/:agenda': 'AgendaController.getAgendaById',
  'get /agenda/extract/:user&:init&:end': 'AgendaController.extractReportForMonth',
  'get /agenda/extractroom/:room&:init&:end': 'AgendaController.getAgendaListByRoom',
  
  'post /guest': 'GuestController.create',
  'delete /guest/:agenda&:guest': 'GuestController.deleteGuest',
  'put /guest/:agenda&:guest': 'GuestController.update',
  'get /guest/:agenda': 'GuestController.get',
  'get /guest/g/:agenda&:guest': 'GuestController.getOne',

  'post /remaneja': 'RemanejaController.createRemaneja',
  'get /remaneja': 'RemanejaController.getAll',
  'get /remaneja/:id': 'RemanejaController.getRemaneja',
  'get /remaneja/ra/:id': 'RemanejaController.getForAgenda',
  'get /remaneja/rt/:target': 'RemanejaController.getForTarget',
  'get /remaneja/ro/:owner': 'RemanejaController.getForOwner',
  'get /remaneja/extract/:init&:end': 'RemanejaController.getByRange',
  'put /remaneja/:id': 'RemanejaController.updateRemaneja'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};