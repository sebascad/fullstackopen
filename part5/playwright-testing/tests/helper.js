const {expect} = require('@playwright/test')

async function createNewBlogPost(page, title = '105 Farenheit', author = 'El alpha', url = 'ejemplo.es') {
  await clickLink(page,'new blog')
  
  await page.getByLabel('title').fill(title);
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);

  await page.getByRole('button', { name: 'create' }).click();

  await page.pause()

  await expect(page.getByText(`a new blog ${title} by ${author} added`)).toBeVisible() //Expects Title + Author
}


async function loginWithInvalidCredentials(page) {
  await page.goto('/login')

  await page.getByLabel('username').fill('nopepito');
  await page.getByLabel('password').fill('2345');
  await page.getByRole('button', { name: 'login' }).click();
}


async function loginAsUser(page) {
  await page.goto('/login')

  await page.getByLabel('username').fill('pepito');
  await page.getByLabel('password').fill('1234');
  await page.getByRole('button', { name: 'login' }).click();
}

async function clickButton(page,name) {
  await page.getByRole('button', { name }).click()
}

async function clickLink(page,name) {
  await page.getByRole('link', { name }).click()
}
module.exports = { loginAsUser, loginWithInvalidCredentials, createNewBlogPost , clickButton, clickLink}