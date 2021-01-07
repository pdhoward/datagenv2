
const Mongo =               require('mongodb').MongoClient;
const { v4: uuidv4 } =      require('uuid')
const {random} =            require('../random')
const {mac} =               require('../random')
const {token} =             require('../random')
const { g, b, gr, r, y } =  require('../console')
const machineurl = process.env.ATLAS_MACHINE_URI
const proximityurl = process.env.ATLAS_PROXIMITY_URI
let dbName = 'machine'
let proximityName = 'proximity'
let db
let dbProximity
let cnt = 0
let traffic = 0
Mongo.connect(machineurl, { useUnifiedTopology: true }, ((err, client) => {
  if (err) console.log(r(`Error connecting to Machine MongoDB`))
  db = client.db(dbName)
  console.log(b(`Machine MongoDB is Live`))
}))
Mongo.connect(proximityurl, { useUnifiedTopology: true }, ((err, client) => {
  if (err) console.log(r(`Error connecting to Proximity MongoDB`))
  dbProximity = client.db(proximityName)
  console.log(b(`Proximity MongoDB is Live`))
}))

const seed = (router) => {
	router.use(async(req, res, next) => {

    // remove all docs from proximity db collection
    await dbProximity.collection('venues')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted!`)
    })

    const zip = await random() 
    console.log(zip)   
    const cursor = db.collection('venues').find({});
    for await (const doc of cursor) {

      doc.address.postalCode = zip.zip
      doc.address.city = zip.city
      doc.address.state = zip.state_id 
      doc.address.stateName = zip.state_name
      doc.address.countyName = zip.county_name
      doc.address.coordinates.lat = parseFloat(zip.lat)
      doc.address.coordinates.lng = parseFloat(zip.lng)
      doc.location.coordinates.length = 0
      doc.location.coordinates.push(parseFloat(zip.lng))
      doc.location.coordinates.push(parseFloat(zip.lat))
      doc.type = "Venue"

      if (doc.monitors) {
        let macaddr = doc.monitors
        doc.monitors = []
        doc.monitors.push(macaddr)
      } else {
        // generate 12 digit random mac addr
        doc.monitors = []
        doc.monitors.push(await mac(12))
      }
      doc.updatedOn = Date.now()
      let venueData = {}
      venueData.marketid = doc.marketid
      venueData.name = doc.name 
      venueData.updatedOn = doc.updatedOn 
      doc.apitoken = await token(venueData)

      // final updates - if enterprise value = local, doc.image randomly reassigned
      // to jpg or svg
      
      cnt = cnt + 1

      await dbProximity.collection('venues')
       .insertOne(doc)
        .catch(err => {
          console.log(err)
          process.exit(1)
        })    
      
    }

    let metrics = await dbProximity.collection('venues').stats()
    console.log(`The Proximity Venue collection has ${metrics.count} documents`)
    
   
    let html = `<h2>${cnt} Machine Venue Documents Were Read!</h2>
                <h4>${metrics.count} Proximity Docs were created </h4>
                <h5> Average Doc Size: ${metrics.avgObjSize} Total DB Size: ${metrics.size} </h5> `
    res.send(html)   
    next()
  })  
}

module.exports = seed

 
  
  
 

  
