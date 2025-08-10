const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/camp-quest')
.then(() => console.log('Database Connected'))
.catch(err => console.log("Database Connection Failed ", err))

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 100; i++){
        const random528 = Math.floor(Math.random() * 528)

        const randomAmount = Math.floor(Math.random() * 24000) + 1000;
        const price = randomAmount - (randomAmount % 100)

        const camp = new Campground({
            owner: '6893764b91586400651701de', // your user id
            location: `${cities[random528].city}, ${cities[random528].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab ullam eius a modi iusto minus, sapiente doloribus, ducimus rem optio pariatur quis natus quibusdam. Labore ad exercitationem voluptatum deserunt sequi.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random528].longitude,
                    cities[random528].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/drezmk9pp/image/upload/v1754550446/CampQuest/ouwelkoznjex8vc61rrq.jpg',
                    filename: 'CampQuest/ouwelkoznjex8vc61rrq',
                },
                {
                    url: 'https://res.cloudinary.com/drezmk9pp/image/upload/v1754550447/CampQuest/zgenocoyvvzmpnrec2jp.jpg',
                    filename: 'CampQuest/zgenocoyvvzmpnrec2jp',
                }
            ],
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})