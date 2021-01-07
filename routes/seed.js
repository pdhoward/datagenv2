
const Mongo =               require('mongodb').MongoClient;
const csv=                  require('csvtojson')
const { v4: uuidv4 } =      require('uuid')
const {random} =            require('../random')
const {randomRange} =       require('../random')
const {venue} =             require('../data/venue.json')
const storenames =          require('../data/storenames')
const { g, b, gr, r, y } =  require('../console')
const url = process.env.ATLAS_URI

let dbName = 'machine'
let db
let cnt = 0
let traffic = 0
Mongo.connect(url, { useUnifiedTopology: true }, ((err, client) => {
  if (err) console.log(r(`Error connecting to MongoDB`))
  db = client.db(dbName)
  console.log(b(`MongoDB is Live`))
}))

const getLocalName = () => {
  let names = ['Grocery Stores', 'Specialty Retail']
  return names[Math.floor(Math.random() * names.length)]
}

const seed = (router) => {
	router.use(async(req, res, next) => {

    // create an array of retail store names to use for random assignment to test object
    const retailFilePath='./data/retailstores.csv'
    const names= await csv().fromFile(retailFilePath)   
    const reduceArray = names.slice(0, 300)
    const selectnames = reduceArray.map(r => r.dba)
    const newRandomNames = [...selectnames, ...storenames]
    console.log(`The array of random store names has ${newRandomNames.length} entries`)

  // ingest spreadsheet of retail stores and locations
    const marketsFilePath='./data/markets.csv'
    const jsonArray = await csv().fromFile(marketsFilePath)  
    const filter = jsonArray.filter(o => o.marketid != "")   // delete blanks   
    console.log(`The array of stores and locations has ${filter.length} entries`)
      
    // iterate through the spreadsheet, creating test venue objects
    const result = filter.map((f) => {      
      // create a doc object with a set of random data for populating a test object
      let data = random()       
      
      // create test document and assign address and coordinates
      let doc = {}
      doc.marketid = uuidv4()
      doc.location ={}
      doc.location.type = 'Point'
      doc.location.coordinates = []
      let lon = data.address.coordinates.lng 
      let lat = data.address.coordinates.lat 
      doc.location.coordinates.push(lon)
      doc.location.coordinates.push(lat)
      doc.address = data.address

      // merge template properties from venue
       
      let newDoc = {...doc, ...venue}

      // assign a random store name or the name from spreadsheet
      if (f.name == null) {
        newDoc.name = newRandomNames[Math.floor(Math.random() * newRandomNames.length)]       
        newDoc.label = newDoc.name
      } else {
        newDoc.name = f.name
        newDoc.label = f.name
        newDoc.website = f.website
        newDoc.phone = f.phone
      }

      // assign random tags for enterprise, geo, lifestyle        
      if (data.enterprise[0].name == 'local') {
        newDoc.enterprise.splice(0, 1, 'local')
        newDoc.image = 'https://placeimg.com/200/200/arch/grayscale'
      } else {
        let name = data.enterprise[0].name
        newDoc.enterprise.splice(0, 1, name )       
        newDoc.image = data.enterprise[0].image
      }      
      let gid = data.geography
      newDoc.geography.splice(0, 1, gid)
      let lid = data.lifemode
      newDoc.lifemode.splice(0, 1, lid)

      // custom assign a market tag based on value of enterprise
      let ent = newDoc.enterprise[0]
      switch(ent) {
        case 'Marriott':
          newDoc.name = "Marriott"
          newDoc.label = "Marriott"
          newDoc.market.splice(0, 1, 'Hotels')
          traffic = randomRange(500, 3500)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break;
        //
        case 'Publix':
          newDoc.name = "Publix"
          newDoc.label = "Publix"
          newDoc.market.splice(0, 1, 'Supermarkets')
          traffic = randomRange(2000, 8000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break;
        case 'Trader Joes':
          newDoc.name = "Trader Joes"
          newDoc.label = "Trader Joes"
          newDoc.market.splice(0, 1, 'Grocery Stores')
          traffic = randomRange(1000, 3500)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break;
        case 'Circle K':
          newDoc.name = "Circle K"
          newDoc.label = "Circle K"
          newDoc.market.splice(0, 1, 'Speciality Stores')
          traffic = randomRange(1000, 2500)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break;
        case 'Whole Foods':
          newDoc.name = "Whole Foods"
          newDoc.label = "Whole Foods"
          newDoc.market.splice(0, 1, 'Supermarkets')
          traffic = randomRange(1000, 4000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break;
        case 'Kroger':
          newDoc.name = "Kroger"
          newDoc.label = "Kroger"
          newDoc.market.splice(0, 1, 'Supermarkets')
          traffic = randomRange(2000, 6000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break;
        case 'University of Texas':
          newDoc.name = "University of Texas"
          newDoc.label = "UT Satellite Campus"
          newDoc.market.splice(0, 1, 'Education')
          traffic = randomRange(10000, 30000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break
        //
        case 'YMCA':
          newDoc.name = "YMCA"
          newDoc.label = "YMCA Community Center"
          newDoc.market.splice(0, 1, 'Fitness Centers')
          traffic = randomRange(8000, 12000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break;
        case 'local':
          let localName = getLocalName()
          newDoc.market.splice(0, 1,localName)
          traffic = randomRange(100, 1000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break
        //
        case 'Dunkin Donut':
          newDoc.name = "Dunkin Donut"
          newDoc.label = "Dunkin Donut"
          newDoc.market.splice(0, 1,'Specialty Stores')
          traffic = randomRange(1000, 3000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break
        default:
          newDoc.market.splice(0, 1,'Supermarkets')
          traffic = randomRange(4000, 15000)
          newDoc.traffic = traffic
          newDoc.attributes.map((a) => {
            if (a.id == "weeklytraffic") a.value = traffic
            return a
          })
          break
      }

      newDoc.timestamp = Date.now()
      newDoc.updatedOn = Date.now()
      
      return JSON.parse(JSON.stringify(newDoc));
    })
    
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
    
   
    let html = `<h2>${cnt} records modified!</h2>`
    res.send(html)   
    next()
  })  
}

module.exports = seed

 
  
  
 

  
