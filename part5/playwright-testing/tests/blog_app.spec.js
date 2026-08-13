const { test , expect , describe, beforeEach } = require('@playwright/test')
const { loginAsUser, loginWithInvalidCredentials, createNewBlogPost , clickButton } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Pepejesu',
        username: 'pepito',
        password: '1234'
      }
    })

    await page.goto('/')
  })

  test('Login Form is shown', async ({ page }) => {
    const locator1 = page.getByRole('heading',{name :'log in to application'})
    const locator2 = page.getByRole('heading',{name: 'Login'})

    await expect(locator1).toBeVisible()
    await expect(locator2).toBeVisible()

    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({page}) => {
      await loginAsUser(page)

      await expect(page.getByText('Pepejesu logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({page}) => {
      await loginWithInvalidCredentials(page)

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })

  })

  describe('When logged in', () => {
    beforeEach(async ({page}) => {
      await loginAsUser(page)
    })

    test('a new blog can be created', async ({page}) => {
      await createNewBlogPost(page)
    })

    describe('When a blog exists', () => {
      beforeEach(async ({page}) => {
        await createNewBlogPost(page)
      })

      test('an existing blog can be updated', async ({page}) => {
        await clickButton(page,'view')

        await clickButton(page,'like')

        await expect(page.getByText('likes 1')).toBeVisible() //After clicking like, it should have 1 like
      })

      test('an existing blog can be succesfully deleted', async ({page}) => {
        await clickButton(page,'view')

        await clickButton(page,'Remove')

        await expect(page.getByText('105 Farenheit El alpha')).not.toBeVisible()
      })
    })

    describe('When several blogs exists', () => {
      beforeEach(async ({ page }) => {
        await createNewBlogPost(page, 'blog1', 'author1', 'url1')
        await createNewBlogPost(page, 'blog2', 'author2', 'url2')
        await createNewBlogPost(page, 'blog3', 'author3', 'url3')
      })

      test('blogs are ordered according to likes', async ({page}) => {
        const viewButtons = page.getByRole('button', {name: 'view'})
        const count = await viewButtons.count()
        //First of all, we have to deploy the details of the blogs to like
        for(let i = 0; i < count; i++){
          await viewButtons.first().click()
        }

        // We get all the blogs from their respective classNames
        const blogs = await page.locator('.blog').all()
        
        //We like the first blog once
        await blogs[0].getByRole('button', {name: 'like'}).click()
        await expect(blogs[0].getByText('likes 1')).toBeVisible()

        const secondBlog = page.locator('.blog', { hasText: 'blog2' })
        // and blog2 three times
        for (let i = 0; i < 3; i++) {
          await secondBlog.getByRole('button', {name: 'like'}).click()
          await expect(secondBlog.getByText(`likes ${i + 1}`)).toBeVisible()
        }

        const updatedBlogs = await page.locator('.blog')
        //Order should be blog2 -> blog1 -> blog 3
        await expect(updatedBlogs.first()).toContainText('blog2')
        await expect(updatedBlogs.nth(1)).toContainText('blog1')
        await expect(updatedBlogs.last()).toContainText('blog3')
      })
    })
  })

  describe('When a blog exists, created by another user', () => {
    beforeEach(async ({page,request}) => {
      await request.post('/api/users', {
        data: {
          name: 'No soy pepito',
          username: 'nopepito',
          password: '2345'
        }
      })

      //pepito creates a blog
      await loginAsUser(page)
      await createNewBlogPost(page)

      await clickButton(page,'logout') //pepito logs out

      await loginWithInvalidCredentials(page) //they're now valid
    })

    test('the remove button is not shown to a user who did not create blog', async ({page}) => {
      await clickButton(page,'view')

      await expect(page.getByRole('button',{name: 'Remove'})).not.toBeVisible()
    })
  })
})



