const Course = ({course}) =>{
   return(
   <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
    )
}

const Header = (props) => {
  return (<h1>{props.name}</h1>)
}

const Part = ({name,exercisesCount}) => {
  return(
    <p> {name} {exercisesCount}</p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map((part => <Part name={part.name} exercisesCount={part.exercises} key={part.id}/>))}
    </div>
  )
}

const Total = ({parts}) => {
  const totalExercises = parts.map(part => part.exercises) 
  const sum = totalExercises.reduce((sum,num) => sum += num)

  return (<b>total of {sum} exercises</b>)
}


export default Course