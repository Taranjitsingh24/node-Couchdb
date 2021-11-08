const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const nodeCouchdb = require('node-couchdb'); // connecting with couchbd by using node-couchdb
const db = new nodeCouchdb({
    auth: {
        user: 'admin', //username
        pass: 'admin'  //password
    }
});
const dbName = "worktodo"; // database name
const viewUrl ="/_design/all_assignments/_view/all";  //url to views all the documents in database
db.listDatabases().then(function(dbs){
   
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const mapreduceURL =
'/_design/all_assignments/_view/count';
const getCount = () => {
    let countAssignments;
    db.get(dbName, mapreduceURL).then(
        function (data, headers, status) {
            countAssignments = data.data.rows
            totalCount =  countAssignments

         
        },
        function (err) {
            res.send(err);
        }
    )
} 
let totalCount =0;

// creating a document with following code
app.get('/', function(req, res){
    
 getCount();
   
    db.get(dbName, viewUrl).then(
        function(data, headers, status){
            
            res.render('index',{
            
                assignments:data.data.rows, totalCount

            });
        },
        function(err){
            res.send(err);
        });
        app.post('/assignment/add', function(req, res){
            const module = req.body.module;
            const title = req.body.title;
            const description = req.body.description;
            const deadline = req.body.deadline;
            
            
                db.insert('worktodo', {
                    
                    module: module,
                    title: title,
                    description: description,
                  deadline: deadline,
                }).then(
                    function(data, headers, status){
                        res.redirect('/');
                    },
                    function(err){
                        res.send(err);

                    });
                

            });
            
        });
  
// deleting a document in the database with following code
app.post('/assignment/delete/:id', function (req, res) {
    const id = req.params.id;
    const rev = req.body.rev;

    db.del(dbName, id, rev).then(
            function (data, headers, status) {
                res.redirect('/');
            },
            function (err) {
                res.send(err);
        });
});
//updating a document
app.post("/assignment/update/:id", function (req, res) {
    const id = req.params.id;


    db.get(dbName, id)
         .then(
            function (data, headers, status) {
                res.render('update',{
                    assignments :data.data
                });
            },
            function (err) {
                res.send(err);
        });
})
app.post("/assignment/update/:id", function (req, res) {
    const id = req.params.id;
    const rev = req.body.rev;

    db.update(dbName, id, rev).then(
            function (data, headers, status) {
                res.redirect('/');
            },
            function (err) {
                res.send(err);
        });
});


  



// server running on port 3000
app.listen(3000, function(){
    console.log('Server running on port 3000, search localhost:3000 on search engine')
    

});
