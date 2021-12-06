const express = require("express")
const fs = require("fs");

const app = express()
const jsonParser = express.json()

app.use(express.static(__dirname + "/public"))

const filePath = "users.json"

app.get("/api/users", function (req, res){
    const content = fs.readFileSync(filePath,"utf8")
    const users = JSON.parse(content)

    res.send(users)
});

app.get("/api/users/:id", function (req, res){
    const id = req.params.id
    const content = fs.readFileSync(filePath, "utf8")
    const users = JSON.parse(content)
    let user = null
    
    for (var i=0; i<users.length; i++) {
        if(users[i].id == id) {
            user = users[i]
            break
        }
    }
    
    if(user){
        res.send(user)
    } else {
        res.status(404).send()
    }
})

app.post("api/users", jsonParser, function (req, res){
    if (!req.body) return res.sendStatus(404)
    
    const userName = req.body.name
    const userAge = req.body.age
    let user = {name: userName, age: userAge}

    let data = fs.readFileSync(filePath, "utf8")
    let users = JSON.parse(data)

    const id = Math.max.apply(Math, users.map(function (o){return o.id}))
    user.id = id + 1

    users.push(user)

    data = JSON.stringify(users)

    fs.writeFileSync("users.json", data)
    res.send(user)
})

app.delete("/api/users/:id", function (req, res) {

})

app.listen(3000)
