
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
      console.log(`${res.deletedCount} records deleted from Subscribers collection!`)
    })

     // create an array of 'fake people' to populate to the subscriber db
     const peoplePath='./data/people.csv'
     const people = await csv().fromFile(peoplePath)
     
     for (const p of people) {
       let person = {}
       person.subscriberid = uuidv4()
       person.type = 'subscriber'
       person.email = p.EmailAddress
       person.username = p.Username 
       person.token = p.Password 
       person.isVerfied = true
       person.isActive = true
       person.preferences = {}
       person.device = p.BrowserUserAgent
       person.timestamp = Date.now()
       person.updatedOn = Date.now()

       // remainder needs to be added to schmema
       person.cell = p.TelephoneNumber 
       person.countrycode = p.TelephoneCountryCode
       person.gender = p.Gender 
       person.title = p.Title 
       person.firstName = p.GivenName 
       person.middleInitial = p.MiddleInitial
       person.lastName = p.Surname 
       person.address1 = p.StreetAddress 
       person.address2 = '' 
       person.city = p.City 
       person.state = p.State 
       person.zipcode = p.ZipCode 
       person.country = p.Country 
       person.birthdate = p.Birthday 
       person.cctype = p.CCType 
       person.ccnumber = p.CCNumber 
       person.cvv2 = p.CVV2
       person.lat = p.Latitude 
       person.lon = p.Longitude   
       subscriberarray.push(person)
     }

     await dbProximity.db('proximity').collection('subscribers')
      .insertMany(subscriberarray)
        .catch(err => {
          console.log(`---ERROR UPDATING SUBSCRIBER COLLECTION ---`)
          console.log(err)
          process.exit(1)
        })

    let metrics = await dbProximity.db('proximity').collection('subscribers').stats()
    console.log(`The Proximity Sub collection has ${metrics.count} documents`)
       
    let html = `<h2>Lots of Data Created</h2>`
             
    res.send(html)   
    next()
  })  
}

module.exports = seedsubscribers

 
  
  
 

  
