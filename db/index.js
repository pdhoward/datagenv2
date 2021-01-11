
const Mongo =               require('mongodb').MongoClient;
const { g, b, gr, r, y } =  require('../console')

let dbName = 'machine'
let proximityName = 'proximity'

//let db
//let dbProximity

const machineurl = process.env.ATLAS_MACHINE_URI
const proximityurl = process.env.ATLAS_PROXIMITY_URI

// Atlas db with old collection of venues - start point for transforms
let db = Mongo.connect(machineurl, { useUnifiedTopology: true }, ((err, client) => {
    if (err) console.log(r(`Error connecting to Machine MongoDB`))
    //db = client.db(dbName)
    console.log(b(`Machine MongoDB is Live`))
    return client.db(dbName)    
  }))

// // Atlas db with new collections with test data sets
// Mongo.connect(proximityurl, { useUnifiedTopology: true }, ((err, client) => {
//     if (err) console.log(r(`Error connecting to Proximity MongoDB`))
//     dbProximity = client.db(proximityName)
//     console.log(b(`Proximity MongoDB is Live`))
    
//   }))
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