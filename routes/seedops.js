
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
  console.log(b(`Proximity OPS MongoDB is Live`))
}))

const seedops = (router) => {
	router.use(async(req, res, next) => {

    // remove all docs from proximity db collection TAG
    await dbProximity.collection('tags')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Tag!`)
    })

    // remove all docs from proximity db collection MESSAGE
    await dbProximity.collection('messages')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Message!`)
    })

    // remove all docs from proximity db collection BRAND
    await dbProximity.collection('brands')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Brand!`)
    })

 

    let metrics = await dbProximity.collection('brands').stats()
    console.log(`The Proximity Brand collection has ${metrics.count} documents`)
    
   
    let html = `<h2>Lots of Data Created</h2>`
             
    res.send(html)   
    next()
  })  
}

module.exports = seedops

 
  
  
 

  
