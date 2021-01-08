
///////////////////////////////////////////////////////////////
////////           atlas code pattern                  ///////
//////            mainline processing                 ///////
////// c strategic machines 2018 all rights reserved ///////
///////////////////////////////////////////////////////////

const express =               require('express');
const path =                  require('path');
const { g, b, gr, r, y } =    require('../console');

// Express app
const app = express();
const Port = process.env.RUN_PORT || 3000

//////////////////////////////////////////////////////////////////////////
////////////////////  Register Middleware       /////////////////////////
////////////////////////////////////////////////////////////////////////

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../public')))

const isDev = (app.get('env') === 'development');
console.log('isDev: ' + isDev);

 //////////////////////////////////////////////////////
 ////////// Register and Config Routes ///////////////
 ////////////////////////////////////////////////////
const about =               express.Router()
const header =              express.Router()
const seedvenues =          express.Router()
const seedops =             express.Router()

require('../routes/about')(about)
require('../routes/seedvenues')(seedvenues)
require('../routes/seedops')(seedops)
require('../routes/header')(header)

/////////////////////////////////////////////////////////
/////////////////// API CATALOGUE //////////////////////
///////////////////////////////////////////////////////

app.use(header)
app.get('/about', about)
app.get('/seedvenues', seedvenues)
app.get('/seedops', seedops)

// start server
app.listen(Port, () => console.log(g(`listening on port ${Port}`)))
