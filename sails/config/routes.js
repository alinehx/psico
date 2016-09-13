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
  'get /class': 'ClassController.getAll',
  'get /class/:name&:location': 'ClassController.getClass',
  'get /address/:zipCode': 'AddressController.getAddress',

  'post /agenda': 'AgendaController.createAgenda',
  'get /agenda/:email': 'AgendaController.getAgendaByResponsable',
  'get /agenda/': 'AgendaController.getAll',
  'put /agenda/:id': 'AgendaController.updateAgenda',
  
  'post /guest/': 'GuestController.create',
  'put /guest/:agenda&:guest': 'GuestController.update',
  'delete /guest/:agenda&:guest': 'GuestController.deleteGuest',
  'get /guest/:agenda': 'GuestController.get'


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
