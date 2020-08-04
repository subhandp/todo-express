const { Todos } = require('./models/todoSchema')
const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express()
const port = 3000

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getTodo = async() => {
    return await Todos.find({});
};

const getTodoId = async(todoId) => {
    return await Todos.findOne({ _id: todoId });
};

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/todo", async(req, res) => {
    const todolist = await getTodo()
        .then((response) => {
            res.render("todo", { todo: response });
        })
        .catch((err) => console.log(err));
});


app.post("/todo/create", async(req, res) => {
    const todo = new Todos({ name: req.body.todo, description: req.body.deskripsi });
    try {
        await todo.save((err, todo) => {
            console.log("saved");
        });
        res.redirect("/todo");
    } catch (err) {
        console.log(err)
        console.log('Kesalahan, data gagal ditambahkan')
        res.redirect("/todo/false");
    }

});

app.get("/todo/delete/:id", async(req, res) => {
    try {
        await Todos.deleteOne({ _id: req.params.id });
        console.log('<Berhasil hapus data>')
        res.redirect("/todo");
    } catch (err) {
        console.log('Kesalahan, data gagal di hapus')
    }
});

app.get("/todo/list", async(req, res) => {
    const todolist = await getTodo()
        .then((response) => {
            res.render("list", { todo: response, list: true });
        })
        .catch((err) => console.log(err));
});

app.get("/todo/doneundone/:id", async(req, res) => {
    const todos = await Todos.findOne({ _id: req.params.id });
    if (todos === null) {
        console.log('Todo Not found!');
    } else {
        let status = todos.status ? false : true;
        try {
            await Todos.findByIdAndUpdate(req.params.id, { status: status }).exec();
            console.log("<Data berhasil di update>");
            res.redirect('back')
        } catch (err) {
            console.log(err)
            console.log('Kesalahan, data gagal di update');
        }
    }
});

app.route('/todo/edit/:id')
    .get(async function(req, res) {
        const todolist = await getTodoId(req.params.id)
            .then((response) => {
                console.log(response);
                res.render("todo", { todoId: response });
            })
            .catch((err) => console.log(err));
    })
    .post(async function(req, res) {
        try {
            await Todos.findByIdAndUpdate(req.params.id, { name: req.body.todo, description: req.body.deskripsi }).exec();
            console.log("<Data berhasil di update>");
            res.redirect('back')
        } catch (err) {
            console.log(err)
            console.log('Kesalahan, data gagal di update');
            res.redirect("/todo/edit/" + req.params.id);
        }
    })



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})