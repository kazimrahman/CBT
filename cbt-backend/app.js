const express = require('express')
const app = express()
const cors = require('cors')
bodyParser = require('body-parser');
const port = 5000



app.use(cors())

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/cbt';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;


// Define schema
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  last_logged_in: Date
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

  // Compile model from schema
  var UserModel = mongoose.model('User', UserSchema );

var JournalEntrySchema = new Schema({
    author: String, //{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title: String,
    situation: String,
    rational_response: Object,
    date_logged: Date,
    date_updated: Date
  }, {
      versionKey: false // You should be aware of the outcome after set to false
  });


// Compile model from schema
var JournalEntryModel = mongoose.model('JournalEntry', JournalEntrySchema );


app.post('/users/:email/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    first_n = req.body.first_name
    last_n = req.body.last_name
    console.log(req.body)
    query = UserModel.findOne({"email": req.params.email},{}, { sort: { 'last_logged_in' : -1 } }, function(err, latest_time) {
        if(latest_time == null){
            var newUser = new UserModel({ first_name: first_n, last_name: last_n, email: req.params.email, last_logged_in: Date.now() });
            newUser.save(function (err) {
                if (err) return handleError(err);
                console.log("New user submitted")
                res.send("New user submitted")
              });
        }else{
            var query = {'email': req.params.email};
            var newUser = new UserModel({ first_name: first_n, last_name: last_n, email: req.params.email, last_logged_in: Date.now() });
            
            UserModel.findOneAndUpdate(query, {last_logged_in : Date.now()}, function(err, found){
                console.log(found)
                console.log(found)
                res.send(found)
            })
        }
    });
    
})

app.get('/users', (req, res) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        data = []
        query = UserModel.find({}, function(err, users) {
            data = users
            res.send(data)
        });
    }
)

app.post('/journalentries/:user_email', (req, res) => {
    user_email = req.params.user_email
    new_entry = { 
        author: user_email,
        title: req.body.title,
        situation: req.body.situation, 
        rational_response: req.body.rational_response,
        date_logged: Date.now(),
        date_updated: null 
    }
    console.log(new_entry)
    var new_e = new JournalEntryModel(new_entry);
    new_e.save(function (err) {
        if (err) return handleError(err);
    });
    console.log(new_e.id)
    console.log("New journal entry submitted")
    res.send("New journal entry submitted")
})

app.get('/journalentries/:email', (req, res) => {
    user = req.params.email
    query = JournalEntryModel.find({"author":user}, function(err, journalEntries) {
        data = journalEntries
        res.send(data)
    });
})

app.delete('/journalentries/:email/delete/:id', (req, res) => {
    user = req.params.email
    to_delete_id = req.params.id
    console.log(to_delete_id)
    JournalEntryModel.findByIdAndRemove(to_delete_id, function (err, deleted) {
            if (err) console.log(err);
            console.log("success", deleted)
            res.send("successfully deleted")

        }
    );
})

app.listen(port, () => console.log(`app listening on port ${port}!`))
