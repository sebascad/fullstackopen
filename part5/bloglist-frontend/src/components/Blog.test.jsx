import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect , test, vi } from 'vitest'

test('renders content of a blog', () => {
  const blog = {
    title: 'Hola',
    author: 'adios',
    url: 'www.ssss.com'
  }

  const { container } = render(<Blog blog={blog} />)

  screen.debug(container)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    `${blog.title} ${blog.author}`
  )
})

test('Neither url or likes are shown by default', () => {
  const blog = {
    title: 'Hola',
    author: 'adios',
    url: 'www.ssss.com',
    likes: 3
  }

  const { container } = render(<Blog blog={blog} />)

  const likes = screen.queryByText('likes', { exact:false })
  const url = container.querySelector('.url')

  expect(likes).toBeNull()
  expect(url).toBeNull()
})

test('When the show button gets clicked, url and likes are shown', async () => {
  const blog = {
    title: 'Hola',
    author: 'adios',
    url: 'www.ssss.com',
    likes: 3,
    user: {
      username: 'user'
    }
  }

  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.debug()

  const likes = screen.queryByText('likes', { exact:false })
  const url = container.querySelector('.url')

  expect(likes).toBeVisible()
  expect(url).toBeVisible()

})

test('When the like button gets clicked twice, the handleLike function gets called accordingly', async () => {
  const blog = {
    title: 'Hola',
    author: 'adios',
    url: 'www.ssss.com',
    likes: 3,
    user: {
      username: 'user'
    }
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} handleLikes={mockHandler}/>
  )

  const user = userEvent.setup()

  const detailsButton = screen.getByText('view')
  await user.click(detailsButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

