
const csv = require('csvtojson')

// array of us zip codes and location coordinates
const uszipsPath='./data/uszips.csv'
const zips = csv().fromFile(uszipsPath)   

console.log(`The array of us zipcodes has ${zips.length} entries`)
 
// random data 
const random = () => {   
        let data = zips[Math.floor(Math.random() * zips.length)]
        
        return data
}
                    
module.exports = {
    random
   
}