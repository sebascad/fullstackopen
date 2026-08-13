import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi } from 'vitest'
import Blog from './Blog'

const blog = {
  id: '123',
  title: 'Hola',
  author: 'adios',
  url: 'www.ssss.com',
  likes: 5,
  user: {
    username: 'prueba',
    name: 'prueba'
  }
}

//Created an aux method, to fix the tests after implementing React Router
const renderBlog = ({ blogs, handleLikes = vi.fn(), handleRemoval = vi.fn(), user }) => {
  return render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route
          path='/blogs/:id'
          element={
            <Blog
              blogs={blogs}
              handleLikes={handleLikes}
              handleRemoval={handleRemoval}
              user={user}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

test('renders content of a blog to unauthenticated users, but buttons are not rendered', () => {
  const { container } = renderBlog({ blogs: [blog], user: null })

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(blog.title)
  expect(div).toHaveTextContent(blog.author)
  expect(div).toHaveTextContent(`likes ${blog.likes}`)

  expect(screen.queryByText('like')).toBeNull()
  expect(screen.queryByText('Remove')).toBeNull()
})

test('shows only the like button to authenticated users who are not the owner', () => {
  const user = { username: 'otroprueba', name: 'otroprueba' }

  renderBlog({ blogs: [blog], user })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.queryByText('Remove')).toBeNull()
})

test('shows like and remove buttons to the owner of the blog', () => {
  const user = { username: 'prueba', name: 'prueba' }

  renderBlog({ blogs: [blog], user })

  expect(screen.getByText('like')).toBeDefined()
  expect(screen.getByText('Remove')).toBeDefined()
})
