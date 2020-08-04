const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/todolist", { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const Schema = mongoose.Schema;

const todosSchema = new Schema({
    name: String,
    description: String,
    status: {
        type: Boolean,
        default: false
    }
});

const Todos = mongoose.model('Todos', todosSchema);

module.exports = { Todos };