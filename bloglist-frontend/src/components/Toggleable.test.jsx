import { render, screen } from "@testing-library/react"
import Toggleable from "./Toggleable"
import { describe } from "vitest"
import userEvent from "@testing-library/user-event"

describe("<Toggleable />", () => {
    let container

    const blog = {
        id: "123",
        title: "Funhouse",
        author: "Mickey Mouse",
        url: "bombom.fi",
        likes: 3
    }

    beforeEach(() => {
        container = render(
            <Toggleable buttonLabel="view" hideLabel="cancel" leftToButton={`${blog.title} ${blog.author}`}>
                <div className="testDiv">
                    something...
                </div>
            </Toggleable>
        ).container
    })

    //test("renders children", () => {
    //    screen.getByText("something...")
    //})
    //test("at start url and likes are not displayed", () => {
    //    const div = container.querySelector(".toggleableNotShown")
    //    expect(div).toHaveStyle("display: none")
    //})
    test("children not visible", () => {
        const element = screen.queryByText("something...")
        expect(element).not.toBeInTheDocument()
    })
    test("after clicking button children are rendered", async () => {
        const user = userEvent.setup()
        const button = screen.getByText("view")
        await user.click(button)

        const div = container.querySelector(".toggleableNotShown")
        screen.getByText("something...")
        expect(div).not.toHaveStyle("display: none")
    })
})