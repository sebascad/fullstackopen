import { useEffect, useState } from 'react'
import countriesService from './services/countries'

const Form = ({setFilter,}) => {
  return(
  <form>
    <p>find countries <input onChange={(event) => setFilter(event.target.value)}></input></p>
  </form>)
}

const Country = (props) => {
  return (
    <div>  
      <div>
        <h1>{props.name}</h1>
        <p>Capital {props.capital}</p>
        <p>Area {props.area}</p>
      </div>

      <div>
        <h2>Languages</h2>
        <ul>
          {Object.values(props.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={props.flag}></img>
      </div>
    </div>
  )
}

const showCountry = (country) =>{
  return <Country name={country.name.common} capital={country.capital} 
           area={country.area} languages ={country.languages} flag ={country.flags.png}/>
}

const Countries = ({countries}) => {
  if(countries.length >10){
    return <p>Too many matches,specify another filter</p>
  }else if (countries.length === 1){
    const country = countries[0]
    return showCountry(country)
  }
  
  return countries.map(country => <p key={country.name.common}> {country.name.common} 
    <button onClick={() => showCountry(country)}>Show</button></p>)
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter,setFilter] = useState("")
 
  useEffect(() => {
    countriesService
    .getAll()
    .then(response => {
      setCountries(response)
    })
  },[])

  const filteredCountries = countries.filter(country =>
  country.name.common.toLowerCase().includes(filter.toLowerCase())
  )


  return (
  <div>
    <Form setFilter={setFilter}/>
    <Countries countries={filteredCountries}/>
  </div>
  )

}

export default App
