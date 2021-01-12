
const {dbProximity} =       require('../db')
const csv=                  require('csvtojson')
const { v4: uuidv4 } =      require('uuid')
const {addresses} =         require('../data/addressesall.js')
const {random} =            require('../random')
const {mac} =               require('../random')
const {token} =             require('../random')
const { g, b, gr, r, y } =  require('../console')

let cnt = 0
let traffic = 0

const seedops = (router) => {
	router.use(async(req, res, next) => {    
    // remove all docs from proximity db collection TAG
    await dbProximity.db('proximity').collection('tags')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Tag!`)
    })

    // remove all docs from proximity db collection MESSAGE
    await dbProximity.db('proximity').collection('messages')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Message!`)
    })

    // remove all docs from proximity db collection BRAND
    await dbProximity.db('proximity').collection('brands')
    .deleteMany({})
    .then((res) => {
      console.log(`${res.deletedCount} records deleted from Brand!`)
    })

    // create an array major brand names to use for random assignment to test object
    const brandPath='./data/brands.csv'
    const brands = await csv().fromFile(brandPath) 

    // generate three entities
    let brand = {}
    let tag = {}
    let message = {}

    console.log(`-----brand load completed----`)
    console.log(brands.length)
    console.log(brands[5])

    brands.forEach(b => {
      brand.brandid = uuidv4()
      brand.type = "Brand"


    })

 

    let metrics = await dbProximity.db('proximity').collection('brands').stats()
    console.log(`The Proximity Brand collection has ${metrics.count} documents`)
    
   
    let html = `<h2>Lots of Data Created</h2>`
             
    res.send(html)   
    next()
  })  
}

module.exports = seedops

 
  
  
 

  
