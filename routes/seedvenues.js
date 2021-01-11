const {db, dbProximity} =   require('../db')
const { v4: uuidv4 } =      require('uuid')
const {random} =            require('../random')
const {mac} =               require('../random')
const {token} =             require('../random')
const {images} =            require('../data/images')
const {svg} =               require('..data/svg')

let cnt = 0
let traffic = 0

let logos = [...images, ...svg]
console.log('------- stats on arrays ------')
console.log(images.length)
console.log(svg.length)
console.log(logos.length)

const seedvenues = (router) => {
	router.use(async(req, res, next) => {

    // remove all docs from proximity db collection
    await dbProximity.db('proximity').collection('venues')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted!`)
    })

    const zip = await random() 
    console.log(zip)   
    const cursor = db.db('machine').collection('venues').find({});
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

      await dbProximity.db('proximity').collection('venues')
       .insertOne(doc)
        .catch(err => {
          console.log(err)
          process.exit(1)
        })    
      
    }

    let metrics = await dbProximity.db('proximity').collection('venues').stats()
    console.log(`The Proximity Venue collection has ${metrics.count} documents`)
    
   
    let html = `<h2>${cnt} Machine Venue Documents Were Read!</h2>
                <h4>${metrics.count} Proximity Docs were created </h4>
                <h5> Average Doc Size: ${metrics.avgObjSize} Total DB Size: ${metrics.size} </h5> `
    res.send(html)   
    next()
  })  
}

module.exports = seedvenues

 
  
  
 

  
