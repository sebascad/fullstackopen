const { test , expect , describe, beforeEach } = require('@playwright/test')
const { loginAsUser, loginWithInvalidCredentials, createNewBlogPost , clickButton , clickLink} = require('./helper')

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

  describe('Login', () => {
    beforeEach(async ({page}) => {
      await page.goto('/login')
    })

    test('succeeds with correct credentials', async ({page}) => {
      await loginAsUser(page)

      await expect(page.getByText('logout')).toBeVisible() //If the logout button is shown -> user logged in
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

      test('an existing blog can be liked', async ({page}) => {
        await clickLink(page,'105 Farenheit by El alpha')

        await clickButton(page,'like')

        await expect(page.getByText('likes 1')).toBeVisible() //After clicking like, it should have 1 like
      })

      test('an existing blog can be succesfully deleted', async ({page}) => {
        await clickLink(page,'105 Farenheit by El alpha')

        await clickButton(page,'Remove')

        await expect(page.getByRole('link', { name: '105 Farenheit by El alpha' })).not.toBeVisible()
      })
    })
  })
})



