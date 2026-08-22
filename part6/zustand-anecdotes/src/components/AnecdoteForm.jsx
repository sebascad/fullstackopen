import { useAnecdoteActions } from "../store"

const AnecdoteForm = () => {
  const {createAction} = useAnecdoteActions()

  const addNote = (e) => {
    e.preventDefault()
    const anecdote = e.target.anecdote.value

    createAction(anecdote)
    e.target.reset()
  }

  return (
  <>
    <h2>create new</h2>

    <form onSubmit={addNote}>
      <div>
        <input name='anecdote'/>
      </div>
      <button type='submit'>create</button>
    </form>
  </>)
}

export default AnecdoteForm