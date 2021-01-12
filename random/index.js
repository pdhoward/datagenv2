
const csv = require('csvtojson')
const jwt = require('jsonwebtoken')

// Note this is the super secret for signing the JWT
// this should be acquired via .env or a microservice
const JWT_SECRET  = 'thisismysecretkey'

// array of us zip codes and location coordinates
const uszipsPath = './data/uszips.csv'
let zips = [] 
csv().fromFile(uszipsPath)
      .then((arr) => {
        zips = [...arr]
      })

// retrieve random object from zipcode array
const random = () => {
    return new Promise((resolve, reject) => {       
        let zip = zips[Math.floor(Math.random() * zips.length)]        
        resolve(zip)
    })        
}

// return a fake mac address in hexadecimal for gateway device
const mac = size => {
    return new Promise((resolve, reject) => {
        resolve( [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''))
    })   
}      

// return a fake id in hexadecimal 
const fakeId = size => {
    return new Promise((resolve, reject) => {
        resolve( [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''))
    })   
}   

// generate a random jwt
function token(venue) {
    return new Promise((resolve, reject) => {
        resolve(jwt.sign(venue, JWT_SECRET))
    })	
}

module.exports = {
    random, 
    mac,
    token,
    fakeId
}