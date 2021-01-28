
const {dbProximity} =       require('../db')
const csv=                  require('csvtojson')
const { v4: uuidv4 } =      require('uuid')
const {random} =            require('../random')
const {mac} =               require('../random')
const {token} =             require('../random')
const { g, b, gr, r, y } =  require('../console')

let cnt = 0
let traffic = 0

let subscriberarray = []

const seedsubscribers = (router) => {
	router.use(async(req, res, next) => {

    // remove all docs from proximity db collection TAG
    await dbProximity.db('proximity').collection('subscribers')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Tag!`)
    })

     // create an array of 'fake people' to populate to the subscriber db
     const peoplePath='./data/people.csv'
     const people = await csv().fromFile(peoplePath) 

     console.log(people[1001])

    let metrics = await dbProximity.db('proximity').collection('subscribers').stats()
    console.log(`The Proximity Sub collection has ${metrics.count} documents`)
       
    let html = `<h2>Lots of Data Created</h2>`
             
    res.send(html)   
    next()
  })  
}

module.exports = seedsubscribers

 
  
  
 

  
