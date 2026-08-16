import { http, HttpResponse } from "msw"
import { mockUser, mockTokens } from "../../fixtures/user"

export const authHandlers = [
  http.post("/api/auth/login", async () => {
    return HttpResponse.json({
      user: mockUser,
    })
  }),

  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    return HttpResponse.json(
      {
        user: {
          ...mockUser,
          firstName: body.firstName || mockUser.firstName,
          lastName: body.lastName || mockUser.lastName,
          email: body.email || mockUser.email,
        },
        ...mockTokens,
      },
      { status: 201 }
    )
  }),

  http.post("/api/auth/refresh", async () => {
    return HttpResponse.json(mockTokens)
  }),

  http.post("/api/auth/logout", () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
