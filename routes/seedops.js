
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

let brandarray = []

let isFirstCycle = true

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
   
    
   
    // iterate array of brands to drive creation of test data
    for (const b of brands) {

      // generate three entities
      let brand = {}
      let tag = {}
      let message = {}
     
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

      brandarray.push(brand)
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
        let idx = Math.floor(Math.random() * products.length)
        tag.name = `${products[idx].DESCRIP} ${products[idx].SIZE}`
        tag.description = getLorem()
        tag.temperature = 75
        tag.scale = 'fahrenheit'
        tag.timestamp = Date.now()
        tag.updatedOn = Date.now()
        tagarray.push(tag)
      } while (cnt < 100)

      // ======= generate messages =======
      
      cnt = 0
      messagearray.length = 0
      
      do {
        cnt = cnt + 1 
        message.type = "message"        
        message.messageid = await fakeId(10)
        message.brandid = brand.brandid
        message.tagid = tagarray[Math.floor(Math.random() * tagarray.length)].tagid
        message.target = ['All']
        message.content = {}
        message.content.tag = 'text'
        message.content.data = {}
        message.content.data.id = await fakeId(10)
        message.content.data.avatar = {}
        message.content.data.avatar.normal = brand.image
        message.content.data.name = brand.name 
        message.content.data.createdAt = Date.now()
        message.content.data.heartCount = Math.floor(Math.random() * 1000)
        message.content.data.ctaType = 'click'
        message.content.data.ctaCount = Math.floor(Math.random() * 500)
        message.content.nodes = []
        let obj = {}
        obj.tag = 'text'
        obj.text = getLogo()
        message.content.nodes.push(obj)
        message.timestamp = Date.now()
        message.updatedOn = Date.now()
        message.start = Date.now()
        let ms = new Date().getTime() + (86400000 * 14)
        message.stop = new Date(ms)
        messagearray.push(message)
      } while (cnt < 20)

      // write test data to each collection
      /*
      await dbProximity.db('proximity').collection('brands')
       .insertOne(brand)
        .catch(err => {
          console.log(`---ERROR UPDATING BRANDS COLLECTION ---`)
          console.log(err)
          process.exit(1)
        })      
      await dbProximity.db('proximity').collection('tags')
      .insertMany(tagarray)
        .catch(err => {
          console.log(`---ERROR UPDATING TAGS COLLECTION ---`)
          console.log(err)
          process.exit(1)
        })
      await dbProximity.db('proximity').collection('messages')
      .insertMany(messagearray)
        .catch(err => {
          console.log(`---ERROR UPDATING MESSAGES COLLECTION ---`)
          console.log(err)
          process.exit(1)
        })
      */
    }

    
    console.log('----filter fake messages ------')
    let ids = messagearray.map(m => m.tagid)
    console.log(`there are a total of ${ids.length} Ids`)
    let filtered = messagearray.filter(({tagid}, index) => !ids.includes(tagid, index + 1))
    console.log(`There are ${messagearray.length} messages`)
    console.log(`After filtering - there are ${filtered.length} left`)
    console.log(filtered.length)
    console.log(`------------------Before-----------`)
    console.log(messagearray)
    console.log(`------------------After-----------`)
    console.log(filtered)

    let metrics = await dbProximity.db('proximity').collection('brands').stats()
    console.log(`The Proximity Brand collection has ${metrics.count} documents`)
    
   
    let html = `<h2>Lots of Data Created</h2>`
             
    res.send(html)   
    next()
  })  
}

module.exports = seedops

 
  
  
 

  
