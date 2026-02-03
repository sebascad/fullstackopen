import { useState , useEffect} from 'react'
import personService from './services/persons'
import SuccessNotification from './components/SuccessNotification'
import ErrorNotification from './components/ErrorNotification'

const Filter = ({filter,filterByName}) => <p>filter shown with <input value={filter} onChange={filterByName}/> </p>

const Form = (props) => {
  return(
    <form onSubmit={props.addPerson}>
        <div>
          <p>name: <input value={props.newName} onChange={props.handlePerson}/></p>
          <p>number: <input value={props.newNumber} onChange={props.handleNumber}/></p>
        </div>

        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({persons, handleDelete}) => {
  return(
    <div>
      {persons.map((person) => 
        <p key={person.name}>  {person.name} {person.number} 
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState("")
  const [filter,setFilter] = useState("")
  const [successMessage,setSuccessMessage] = useState(null)
  const [errorMessage,setErrorMessage] = useState(null)

  const personAlreadyExists = (name) => persons.some(person => person.name === name)
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  },[])

  const changeNumber = () => {
    const change = window.confirm(newName + 
        " is already added to phonebook, replace the old number with a new one?")

      if(change){
        const person = persons.find(person => person.name === newName)
        const updatedPerson = {...person,number: newNumber}

        personService.changeNumber(updatedPerson)
          .then(response => {
            setPersons(persons.map(person => person.name === newName ? response.data : person))
            setSuccessMessage(`Changed ${person.name}'s number`)
            setNewName("")
            setNewNumber("")
          })
          .catch(error => {
            setErrorMessage(`Information of ${person.name} has been deleted from the server`)
            setPersons(persons.filter(person => person.name !== updatedPerson.name))
          })
        
      }
  }

  const addPerson = () =>{
    const newPerson = {
      name: newName,
      number:newNumber
    }

    personService
      .create(newPerson)
      .then(response =>{
        setPersons(persons.concat(response.data))
        setNewName("")
        setNewNumber("")
        setSuccessMessage(`Added ${newPerson.name}`)
      })
  }
  
  const deletePerson = (id) => {
    const person = persons.find((person) => person.id === id)

    if(window.confirm(`Delete ${person.name} ?`)){
      personService
      .deletePerson(id)
      .then(() =>{
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  const handleInput = (event) => {
    event.preventDefault()
    personAlreadyExists(newName) ? changeNumber() : addPerson()
  }

  const handlePerson = (event) =>{
    setNewName(event.target.value)
  }
  
  const handleNumber= (event) =>{
    setNewNumber(event.target.value)
  }

  const filterByName = (event) =>{
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage}/>
      <SuccessNotification message={successMessage}/>
      <Filter filter={filter} filterByName={filterByName}/>

      <h3>add a new:</h3>
      <Form addPerson={handleInput} newName={newName} newNumber={newNumber} 
      handleNumber={handleNumber} handlePerson={handlePerson}/>

      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDelete={deletePerson}/>

    </div>
  )
}

export default App