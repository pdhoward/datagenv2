
const {dbProximity} =       require('../db')
const csv=                  require('csvtojson')
const { v4: uuidv4 } =      require('uuid')
const {addresses} =         require('../data/addressesall.js')
const {lorem} =             require('../data/lorem.js')
const {random} =            require('../random')
const {fakeId} =            require('../random')
const {token} =             require('../random')
const {images} =            require('../data/images')
const {svg} =               require('../data/svg')
const { g, b, gr, r, y } =  require('../console')

let cnt = 0
let tagarray = []

let messagearray = []

let logos = [...images, ...svg]

const getAddress = () => {
  return addresses[Math.floor(Math.random() * addresses.length)]
}

const getLorem = () => {
  return lorem[Math.floor(Math.random() * lorem.length)]
}

const getLogo = () => {
  return logos[Math.floor(Math.random() * logos.length)]
}

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

    // create an array products to use for random assignment to test object
    const productPath='./data/products.csv'
    const products = await csv().fromFile(productPath) 

    ///////////////
    console.log('------- product array completed ---------')
    console.log(products.length)
    console.log(products[5])

    // generate three entities
    let brand = {}
    let tag = {}
    let message = {}

    console.log(`-----brand array completed----`)
    console.log(brands.length)
    console.log(brands[5])

    for (const b in brands) {

      // ======= build brand object ====== 
      brand.brandid = uuidv4()
      brand.type = "brand"
      let address = getAddress()
      brand.address = address 
      brand.location = {}
      brand.location.type = "Point"
      brand.location.coordinates = []
      brand.location.coordinates.push(address.coordinates.lng)
      brand.location.coordinates.push(address.coordinates.lat)
      brand.industry = b.Sector
      brand.symbol = b.Symbol 
      brand.name = b.Name 
      brand.label = b.Name
      brand.isActive = true 
      brand.isVerified = {}
      brand.isVerified.result = true 
      brand.isVerified.verifiedDate = Date.now()
      brand.isVerified.verifiedMethod = "inspection"
      brand.overview = getLorem()
      brand.image = getLogo()
      brand.slug = null 
      brand.website = 'https://example.com/'
      brand.phone = null 
      brand.timestamp = Date.now()
      brand.updatedOn = Date.now()

      // ====== generate tags ========
      cnt = 0
      tagarray.length = 0
      
      do {
        cnt = cnt + 1 
        tag.type = "tag"
        tag.class = "product"
        tag.tagid = await fakeId(10)
        tag.brandid = brand.brandid 
        tag.imdbid = await fakeId(14)
        tag.name = '***************'
        tag.description = getLorem()
        tag.temperature = 75
        tag.scale = 'fahrenheit'
        tag.timestamp = Date.now()
        tag.updatedOn = Date.now()
        tagarray.push(tag)
      } while (cnt < 100)

      // ======= generate messages for tags =======
      // ====== generate tags ========
      cnt = 0
      tagarray.length = 0
      
      do {
        cnt = cnt + 1 
        tag.type = "tag"
        tag.class = "product"
        tag.tagid = await fakeId(10)
        tag.brandid = brand.brandid 
        tag.imdbid = await fakeId(14)
        tag.name = '***************'
        tag.description = getLorem()
        tag.temperature = 75
        tag.scale = 'fahrenheit'
        tag.timestamp = Date.now()
        tag.updatedOn = Date.now()
        tagarray.push(tag)
      } while (cnt < 100)
      
    }

    console.log('----fake tag generated -----')
    console.log(tagarray.length)
    console.log(tagarray[5])
    

    let metrics = await dbProximity.db('proximity').collection('brands').stats()
    console.log(`The Proximity Brand collection has ${metrics.count} documents`)
    
   
    let html = `<h2>Lots of Data Created</h2>`
             
    res.send(html)   
    next()
  })  
}

module.exports = seedops

 
  
  
 

  
