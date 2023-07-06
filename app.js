const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require("body-parser"); // we didn't use it here can know about it from documentary.
const port = 8000;

main().catch(err => console.log(err));  // connection to mongodb taken from mongoose documentary
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/contactDance');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,      // Creating mongoose schema
    address: String,
    desc: String
  });

const Contact = mongoose.model('Contact', contactSchema);  

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded())

// PUG SPECIFIC STUFF
app.set('view engine', 'pug') // Set the template engine as pug that to serve the file in pug code so our css and js works that pug is written in a code different than html.
app.set('views', path.join(__dirname, 'views')) // Set the views directory here we are setting the path to views folder to search for folders.
 
// ENDPOINTS
app.get('/', (req, res)=>{
    const params = {}
    res.status(200).render('home.pug', params);  // Attaching the local host to ondex file using pug.
})

app.get('/contact', (req, res)=>{
    const params = {}
    res.status(200).render('contact.pug', params);  
})

app.post('/contact', (req, res)=>{
    var myData = new Contact(req.body); // We are saying here to make a contact object from the incoming data from the form submission and saving that data's object form in myData but to access incoming data body we use req.body 
    myData.save().then(() => {  //saving the incoming data but it's in promise so we need to return promise by sending it
        res.send("This item has been saved to the database");
    }).catch(() =>{
        res.status(400).send("Item was not saved to the database"); // Here we are sending catch if we get's error in saving the data
    })
})

// START THE SERVER
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`); // listening the server to port using express
});