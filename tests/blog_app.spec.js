const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require("./helper")

describe('Note app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')

        await request.post('/api/users', {
        data: {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
            }
        })
    await page.goto('/')
    })
    test("Login form is shown", async ({ page }) => {
        const locator = await page.getByText("Login to application")
        await expect(locator).toBeVisible()
        await expect(page.getByText("username")).toBeVisible()
    })

    describe("Login", () => {
        test('succeeds with correct credentials', async ({ page }) => {
            const textboxes = await page.getByRole("textbox").all()
    
            await textboxes[0].fill("mluukkai")
            await textboxes[1].fill("salainen")
    
            await page.getByRole("button", {name: "login"}).click()
    
            const twoSame = await page.getByTestId("notification").innerText()
    
            await expect(twoSame).toContain("logged in as mluukkai")
        })
        test('fails with wrong credentials', async ({ page }) => {
            const textboxes = await page.getByRole("textbox").all()
    
            await textboxes[0].fill("mluukk")
            await textboxes[1].fill("salainen")

            await page.getByRole("button", {name: "login"}).click()

            await expect(page.getByText("wrong")).toBeVisible()
        })
    })
    describe("When logged in", () => {
        beforeEach( async ({page}) => {
            await loginWith(page, "mluukkai", "salainen")
        })
        test("a new blog can be created", async ({page}) => {
            await page.getByTestId("toggleableButtonLabel").click()

            const textboxes = await page.getByRole("textbox").all()
            await textboxes[0].fill("uusi blogi")
            await textboxes[1].fill("mikki hiiri")
            await textboxes[2].fill("kirja.com")

            await page.getByRole("button", {name: "create"}).click()

            await expect(page.locator(".blog").locator("text=uusi blogi")).toBeVisible()
        })

    })
    describe("When created a blog", () => {
        beforeEach( async ({page}) => {
            await loginWith(page, "mluukkai", "salainen")
            await page.getByRole("button", {name: "logout"}).waitFor()

            await createBlog(page, "uusi blogi", "mikki hiiri", "kirja.com")
            await page.waitForTimeout(500)

            await createBlog(page, "uusi blogi", "mikki hiiri", "kirja.com")
            await page.waitForTimeout(500)
        })
        test("a blog can be liked", async ({page}) => {
            const allBlogs = await page.locator(".blog").all()
            await allBlogs[0].getByRole("button", {name: "view"}).click()
            await page.waitForSelector('text=Matti Luukkainen')
            await allBlogs[1].getByRole("button", {name: "view"}).click()
            await allBlogs[0].getByRole("button", {name: "hide"}).click()
            await allBlogs[1].getByRole("button", {name: "like"}).click()
            await page.getByText("likes 1").waitFor()
            //console.log("1")
            await allBlogs[0].getByRole("button", {name: "like"}).click()
            //console.log("2")
            await page.getByText("likes 2").waitFor()
            //console.log("3")
            await expect(page.getByText("Matti Luukkainen")).toBeVisible()
            await expect(page.getByText("likes 2")).toBeVisible()
        })
        test("a blog can be removed", async ({page}) => {
            const allBlogs = await page.locator(".blog").all()
            await allBlogs[0].getByRole("button", {name: "view"}).click()
            await allBlogs[0].getByRole("button", {name: "hide"}).click()
            await allBlogs[0].getByRole("button", {name: "view"}).click()
            page.on("dialog", async (dialog) => {
                expect(dialog.type()).toBe("confirm")
                expect(dialog.message()).toBe("Remove blog uusi blogi by mikki hiiri")
                await dialog.accept()
            })
            await allBlogs[0].getByRole("button", {name: "remove"}).click()
            await expect(page.getByText("likes 0")).not.toBeVisible() 
        })
    })
    describe("When using another user", () => {
        beforeEach( async ({ page, request }) => {
            await loginWith(page, "mluukkai", "salainen")
            await page.getByRole("button", {name: "logout"}).waitFor()

            await createBlog(page, "ensimmainen blogi", "mikki hiiri", "kirja.com")
            await page.waitForTimeout(500)

            await createBlog(page, "toinen blogi", "mikki hiiri", "kirja.fi")
            await page.waitForTimeout(500)

            await createBlog(page, "kolmas blogi", "minnni hiiri", "kirja.com")
            await page.waitForTimeout(500)

            await page.getByRole("button", {name: "logout"}).click()

            await request.post('/api/users', {
                data: {
                    name: 'Toinen Luukkainen',
                    username: 'Tluukkai',
                    password: 'salaiset'
                    }
                })
            await loginWith(page, "Tluukkai", "salaiset")
        })
        test("cannot see remove button others' blogs", async ({page}) => {
            const twoSame = await page.getByTestId("notification").innerText()
            await expect(twoSame).toContain("logged in as Tluukkai")
            const allBlogs = await page.locator(".blog").all()
            await allBlogs[0].getByRole("button", {name: "view"}).click()
            await allBlogs[0].getByRole("button", {name: "hide"}).click()
            await allBlogs[0].getByRole("button", {name: "view"}).click()

            await expect(page.getByRole("button", {name: "remove"})).not.toBeVisible() 
        })
        test("blogs are ordered with the most likes descending", async ({page}) => {
            await page.waitForTimeout(500)
            const allaBloggar = await page.locator(".blog").all()
            await allaBloggar[0].getByRole("button", {name: "view"}).click()
            await allaBloggar[1].getByRole("button", {name: "view"}).click()
            await allaBloggar[2].getByRole("button", {name: "view"}).click()

            await expect(page.getByRole("button", {name: "remove"})).not.toBeVisible()

            await allaBloggar[2].getByRole("button", {name: "like"}).click()
            await allaBloggar[0].getByText("likes 1").waitFor()

            await allaBloggar[0].getByRole("button", {name: "like"}).click()
            await allaBloggar[0].getByText("likes 2").waitFor()

            await allaBloggar[0].getByRole("button", {name: "like"}).click()
            await allaBloggar[0].getByText("likes 3").waitFor()

            await allaBloggar[2].getByRole("button", {name: "like"}).click()
            await allaBloggar[1].getByText("likes 1").waitFor()

            await allaBloggar[1].getByRole("button", {name: "like"}).click()
            await allaBloggar[1].getByText("likes 2").waitFor()

            await expect(allaBloggar[0].getByText("likes 3")).toBeVisible()
            await expect(allaBloggar[1].getByText("likes 2")).toBeVisible()
            await expect(allaBloggar[2].getByText("likes 0")).toBeVisible()
        })
    })
})