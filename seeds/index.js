const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
  console.log("Database Connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 200; i++) {
    const random = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '660cc8477dc62442ba80c81e',
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia amet atque ipsam necessitatibus nemo sunt odit rerum sapiente tenetur placeat. Hic atque vel vitae quas nisi delectus laudantium molestias maxime.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random].longitude,
          cities[random].latitude
        ]
      },
      image: [
        {
          url: 'https://res.cloudinary.com/dzadofsp3/image/upload/v1712203790/YelpCamp/y8y7wtpjyzpefghssycq.jpg',
          filename: 'YelpCamp/y8y7wtpjyzpefghssycq',
        },
        {
          url: 'https://res.cloudinary.com/dzadofsp3/image/upload/v1712203794/YelpCamp/pkxdktqklvewrtxplus5.jpg',
          filename: 'YelpCamp/pkxdktqklvewrtxplus5',
        }
      ]
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})