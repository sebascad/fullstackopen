const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()
const Person = require("./models/person")
const PORT = process.env.PORT | 3001

app.use(express.static("dist"))
app.use(cors())
app.use(express.json())

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
)

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  })
})

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`
        <div>
          <p>Phonebook has info for ${persons.length} people</p>
          <p>${new Date()}</p>
        </div>
      `)
  })
})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result =>{
      response.status(204).end()
    })
})

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  morgan.token()
  
  person.save().then(savedPerson =>{
    response.json(savedPerson)
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
