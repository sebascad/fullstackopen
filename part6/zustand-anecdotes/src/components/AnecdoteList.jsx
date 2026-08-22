import { useAnecdoteActions, useAnecdotes } from "../store"
import Anecdote from "./Anecdote"

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const sortedAnecdotes = anecdotes.toSorted((a,b) => b.votes - a.votes)

  const {voteAction} = useAnecdoteActions()

  const vote = id => {
    voteAction(id)
  }

  return(
    <>
      {sortedAnecdotes.map(anecdote => (
        <Anecdote key={anecdote.id} anecdote={anecdote} vote={vote} />
      ))}
    </>
  )
}

export default AnecdoteList