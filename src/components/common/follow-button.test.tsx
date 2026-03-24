import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { FollowButton } from "./follow-button"
import { renderWithProviders } from "@/test/test-utils"

describe("FollowButton", () => {
  it("toggles the follow state, persists it, and shows toast feedback", async () => {
    const user = userEvent.setup()

    renderWithProviders(<FollowButton artistId="blackpink" />)

    const button = screen.getByRole("button", { name: "Follow" })

    await user.click(button)

    expect(screen.getByRole("button", { name: "Following" })).toBeInTheDocument()
    expect(await screen.findByText("Artist added to your follow list.")).toBeInTheDocument()
    expect(
      JSON.parse(window.localStorage.getItem("kpop-ticket-hub:follows") ?? "[]"),
    ).toContain("blackpink")
  })
})
