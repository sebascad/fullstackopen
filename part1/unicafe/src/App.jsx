import { useState } from 'react'


const Header = ({title}) => (<h1>{title}</h1>)

const StatisticLine = ({text,value}) => {
  return(
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)
}
  
  

const Statistics = ({good,neutral,bad}) => {
    const total = good+neutral+bad
    if(total === 0){
      return (
      <div>
        <Header title={"statistics"} />
        <p>No Feedback Given</p>
      </div>
    )
    }

    return (
      <div>
        <Header title={"statistics"}/>
        <table>
          <tbody>
            <StatisticLine text={"good"} value={good}/>
            <StatisticLine text={"neutral"} value={neutral}/>
            <StatisticLine text={"bad"} value={bad}/>
            <StatisticLine text={"all"} value={total} />
            <StatisticLine text={"average"} value={(good - bad)/total} />
            <StatisticLine text={"positive"} value={(good/total)*100 + "%"} />
          </tbody>
        </table>
      </div>
    )
}

const Button = ({onClick,text}) => (<button onClick={onClick}> {text} </button>)

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGoodByOne = () => { setGood(good+1) }
  const incrementNeutralByOne = () => { setNeutral(neutral+1) }
  const incrementBadByOne = () => { setBad(bad+1) }

  return (
    <div>
      <Header title={"give feedback"} />
      <Button text={"good"} onClick={incrementGoodByOne}/>
      <Button text={"neutral"} onClick={incrementNeutralByOne} />
      <Button text={"bad"} onClick={incrementBadByOne} />

      <Statistics good={good} neutral={neutral} bad={bad}/>

    </div>
  )
}

export default App