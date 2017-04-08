sqlite3 = require('sqlite3').verbose();
express = require('express');
 bodyParser = require('body-parser');

app = express();
db = new sqlite3.Database('sqlite.db');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');
// app.engine('.html',require('ejs').__express);
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
    db.all('SELECT * FROM todos ORDER BY name', function(err, row) {
        if(err !== null) {
            next(err);
        }
        else {
            console.log(row);
            res.render('index', {todos: row});
        }
    });
});

app.post('/add_todo', function(req, res, next) {
    name = req.body.name;
    sqlRequest = "INSERT INTO 'todos' (name) VALUES('" + name + "')";
    db.run(sqlRequest, function(err) {
        if(err !== null) {
            next(err);
        }
        else {
            res.redirect('back');
        }
    });
});
//
// app.put('/edit/:id', function (req,res,next) {
//     name_edit = req.body.name_edit;
//     console.log(name_edit);
//     db.run("UPDATE todos SET name ='"+ name_edit +"' WHERE id='"+ req.params.id + "' ",
//         function (err) {
//             if (err !== null) {
//                 next(err)
//             }
//             else {
//                 res.redirect('back')
//             }
//         });
// });

app.get('/delete/:id', function(req, res, next) {
    db.run("DELETE FROM todos WHERE id='" + req.params.id + "' ",
        function(err) {
            if(err !== null) {
                next(err);
            }
            else {
                res.redirect('back');
            }
        });
});

app.listen(port=3000,host = '0.0.0.0', function () {
    console.log('app listening on port 3000');
});
