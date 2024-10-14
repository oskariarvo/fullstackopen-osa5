import { render, screen } from "@testing-library/react"
import Blog from "./Blog"
import { describe } from "vitest"
import userEvent from "@testing-library/user-event"

describe("<Blog />", () => {
    let container
    let mockHandler

    const blog = {
        id: "123",
        title: "Funhouse",
        author: "Mickey Mouse",
        url: "bombom.fi",
        likes: 3,
        user: {
            username: "dingdong123",
            name: "Ding Dong",
            blogs: [
            "id12456", "id45632"
            ],
            id: 456
        }
    }
    const user = {
        username: "dingdong123"
    }

    beforeEach(() => {
        mockHandler = vi.fn()
        container = render(<Blog blog={blog} user={user} changeBlog={mockHandler} />).container
    })

    test("renders content title and author", () => {
        expect(screen.getAllByText("Funhouse Mickey Mouse")).toBeDefined()
    })
    test("doesn't render url", () => {
        const urlElement = screen.queryByText(blog.url)
        expect(urlElement).not.toBeInTheDocument()
    })
    test("doesn't render likes", () => {
        const likesElement = screen.queryByText(blog.likes)
        expect(likesElement).not.toBeInTheDocument()
    })
    test("url and likes are rendered after clicking the button", async () => {
        const user = userEvent.setup()
        const button = screen.getByText("view")
        await user.click(button)

        const div = container.querySelector(".toggleableNotShown")
        expect(screen.getByText("bombom.fi")).toBeInTheDocument()
        expect(screen.getByText("likes 3")).toBeInTheDocument()
        expect(screen.getByText("Ding Dong")).toBeInTheDocument()
        expect(div).not.toHaveStyle("display: none")
    })
    test("clicking the like button 2 times", async () => {
        const user = userEvent.setup()
        const button = screen.getByText("view")
        await user.click(button)
        const likeButton = screen.getByText("like")
        await user.click(likeButton)
        await user.click(likeButton)

        //const div = container.querySelector(".toggleableNotShown")
        screen.getByText("bombom.fi")
        screen.getByText("likes 3")
        screen.getByText("Ding Dong")
        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})