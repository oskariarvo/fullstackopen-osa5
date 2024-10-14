const loginWith = async (page, username, password) => {
    await page.getByRole("textbox").first().fill(username)
    await page.getByRole("textbox").last().fill(password)
    await page.getByRole("button", {name: "login"}).click()
}
const createBlog = async (page, title, author, url) => {
    await page.getByRole("button", {name: "create new blog"}).click()
    const textboxes = await page.getByRole("textbox").all()
    await textboxes[0].fill(title)
    await textboxes[1].fill(author)
    await textboxes[2].fill(url)
    await page.getByRole("button", {name: "create"}).click()
}

export { loginWith, createBlog }