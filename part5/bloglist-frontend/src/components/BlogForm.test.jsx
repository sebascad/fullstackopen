import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { expect, vi } from 'vitest'

test('When a blog is submitted, createBlog function gets called with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog}/>)

  screen.debug(container)

  const titleInput = container.querySelector('.title')
  const authorInput = container.querySelector('.author')
  const urlInput = container.querySelector('.url')

  const sendButton = screen.getByText('send')

  await user.type(titleInput,'El Quijote')
  await user.type(authorInput,'Cervantes')
  await user.type(urlInput,'Cervantes.es')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual({
    title: 'El Quijote',
    author: 'Cervantes',
    url: 'Cervantes.es'
  })
})