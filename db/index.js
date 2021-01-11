
const Mongo =               require('mongodb').MongoClient;
const { g, b, gr, r, y } =  require('../console')

let dbName = 'machine'
let proximityName = 'proximity'

//let db
//let dbProximity

const machineurl = process.env.ATLAS_MACHINE_URI
const proximityurl = process.env.ATLAS_PROXIMITY_URI

const db = new Mongo(machineurl, { useNewUrlParser: true, useUnifiedTopology: true });
db.connect(err => {
  if (err) {
    console.log('Error connecting to Machine')
  } else {    
    console.log(b(`Machine MongoDB is Live`))
  }
})

const dbProximity = new Mongo(proximityurl, { useNewUrlParser: true, useUnifiedTopology: true });
dbProximity.connect(err => {
  if (err) {
    console.log('Error connecting to Proximity')
  } else {    
    console.log(b(`Proximity MongoDB is Live`))
  }
})



  module.exports = {
      db,
      dbProximity
  }