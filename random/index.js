
const csv = require('csvtojson')

// array of us zip codes and location coordinates
const uszipsPath = './data/uszips.csv'
let zips = [] 
csv().fromFile(uszipsPath)
      .then((arr) => {
        zips = [...arr]
      })
// random data 
const random = () => {
    return new Promise((resolve, reject) => {
        console.log(`The array of us zipcodes has ${zips.length} entries`)
        let zip = zips[Math.floor(Math.random() * zips.length)]
        
        resolve(zip)
    })        
}
                    
module.exports = {
    random   
}