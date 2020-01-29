var mongoose = require('mongoose');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function (e) { console.error(e); });

// definimos el schema
var schema = mongoose.Schema({
    count: Number,
    name: String
});

// definimos el modelo
var Visitor = mongoose.model("Visitor", schema);

app.get('/', (req, res) => {
    var nombre = req.query.name;
    if (nombre == null || nombre == '') {
        nombre = "Anónimo";
        Visitor.create({ name: nombre, count: 1 }, function (err) {
            if (err) return console.error(err);
        });
    } else {
        Visitor.find({ name: nombre }, function (err, docs) {
            if (docs.length == 0) {
                Visitor.create({ name: nombre, count: 1 }, function (err) {
                    if (err) return console.error(err);
                });
            } else {
                Visitor.updateOne({ _id: docs[0]._id }, { $set: { count: docs[0].count + 1 } }, function (err) {
                    if (err) return console.error(err);
                });
            }
        });
    }

    Visitor.find({}, (err, visitors) => {
        res.render('index', { visitors: visitors });
    });
});

app.listen(3000, () => console.log('Listening on port 3000!'));