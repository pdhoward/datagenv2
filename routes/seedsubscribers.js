
const Mongo =               require('mongodb').MongoClient;
const { v4: uuidv4 } =      require('uuid')
const {random} =            require('../random')
const {mac} =               require('../random')
const {token} =             require('../random')
const { g, b, gr, r, y } =  require('../console')
const proximityurl = process.env.ATLAS_PROXIMITY_URI

let proximityName = 'proximity'

let dbProximity
let cnt = 0
let traffic = 0

Mongo.connect(proximityurl, { useUnifiedTopology: true }, ((err, client) => {
  if (err) console.log(r(`Error connecting to Proximity MongoDB`))
  dbProximity = client.db(proximityName)
  console.log(b(`Proximity SUBS MongoDB is Live`))
}))

const seedsubscribers = (router) => {
	router.use(async(req, res, next) => {

    // remove all docs from proximity db collection TAG
    await dbProximity.collection('subscribers')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Tag!`)
    })

   

    let metrics = await dbProximity.collection('subscribers').stats()
    console.log(`The Proximity Sub collection has ${metrics.count} documents`)
    
   
    let html = `<h2>Lots of Data Created</h2>`
             
    res.send(html)   
    next()
  })  
}

module.exports = seedsubscribers

 
  
  
 

  
