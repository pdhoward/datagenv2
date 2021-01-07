
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
    const zip = await random() 
    console.log(zip)   
    const cursor = db.collection('venues').find({});
    for await (const doc of cursor) {

      doc.address.postalCode = zip.zip
      doc.address.city = zip.city
      doc.address.state = zip.state_id 
      doc.address.stateName = zip.state_name
      doc.address.countyName = zip.county_name
      doc.address.coordinates.lat = parseInt(zip.lat)
      doc.address.coordinates.lng = parseInt(zip.lng)
      doc.location.coordinates.length = 0
      doc.location.coordinates.length.push(parseInt(zip.lng))
      doc.location.coordinates.length.push(parseInt(zip.lat))
      doc.type = "Venue"

      if (doc.monitors) {
        let macaddr = doc.monitors
        doc.monitors = []
        doc.monitor.push(macaddr)
      } else {
        // generate 12 digit random mac addr
        doc.monitors = []
        doc.monitor.push(mac(12))
      }
      doc.updatedOn = Date.now()
      let venueData = {}
      venueData.marketid = doc.marketid
      venueData.name = doc.name 
      venueData.updatedOn = doc.updatedOn 
      doc.apitoken = token(venueData)
      
      cnt = cnt + 1
      
      await dbProximity.collection('venues')
      .deleteMany({})
      .then((res) => {
        console.log(`${res.deletedCount} records deleted!`)
      })
      .then(() => db.collection('venues').insert(doc))
      .catch(err => {
        console.log(err)
        process,exit(1)
      })    
      
    }

    let count = await dbProximity.collection('venues').stats
    console.log(`The Proximity Venue collection has ${count} documents`)
    /*
    // read through machine/venue collection using the cursor
    const result = filter.map((f) => {      
      // create a doc object with a set of random data for populating a test object
      
     

      // assign random tags for enterprise, geo, lifestyle        
      if (data.enterprise[0].name == 'local') {
        newDoc.enterprise.splice(0, 1, 'local')
        newDoc.image = 'https://placeimg.com/200/200/arch/grayscale'
      } else {
        let name = data.enterprise[0].name
        newDoc.enterprise.splice(0, 1, name )       
        newDoc.image = data.enterprise[0].image
      }      
     

      // custom assign a market tag based on value of enterprise
      let ent = newDoc.enterprise[0]
      switch(ent) {
        case 'Marriott':
         
          break;
        //
        case 'Publix':
         
          break;
        case 'Trader Joes':
         
          break;
        case 'Circle K':
         
          break;
        case 'Whole Foods':
         
          break;
        case 'Kroger':
         
          break;
        case 'University of Texas':
          
          break
        //
        case 'YMCA':
         
          break;
        case 'local':
         
          break
        //
        case 'Dunkin Donut':
         
          break
        default:
         
          break
      }

      newDoc.timestamp = Date.now()
      newDoc.updatedOn = Date.now()
      
      return JSON.parse(JSON.stringify(newDoc));
    })
    /*
    await db.collection('venues')
      .deleteMany({})
      .then((res) => {
        console.log(`${res.deletedCount} records deleted!`)
      })
      .then(() => db.collection('venues').insertMany(result))
      .then(data => {
        console.log(`${data.result.n} records inserted!`); 
        cnt = data.result.n        
        db.collection('venues').createIndex({location: "2dsphere"})
      //process.exit(0)  
      })
      .catch(err => {
        console.log(err)
        process,exit(1)
      })          
    */
   
    let html = `<h2>${cnt} records modified!</h2>`
    res.send(html)   
    next()
  })  
}

module.exports = seed

 
  
  
 

  
