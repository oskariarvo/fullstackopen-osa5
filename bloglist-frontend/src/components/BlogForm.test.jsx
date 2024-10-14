import { render, screen } from "@testing-library/react"
import { describe, test } from "vitest"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
    let container
    let mockHandler

    beforeEach(() => {
        mockHandler = vi.fn()
        container = render(<BlogForm createBlog={mockHandler} />).container
    })
    test("create new", async () => {
        const user = userEvent.setup()
        const input = screen.getAllByRole("textbox")
        const button = screen.getByText("create")
        await user.type(input[0], "Funhouse")
        await user.type(input[1], "Mickey Mouse")
        await user.type(input[2], "bombom.fi")
        await user.click(button)
        //console.log(mockHandler.mock.calls[0][0].title)
        expect(mockHandler.mock.calls).toHaveLength(1)
        expect(mockHandler.mock.calls[0][0].title).toBe("Funhouse")
        expect(mockHandler.mock.calls[0][0].author).toBe("Mickey Mouse")
        expect(mockHandler.mock.calls[0][0].url).toBe("bombom.fi")
        
    })
})