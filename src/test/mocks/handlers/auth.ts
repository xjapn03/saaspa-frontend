import { http, HttpResponse } from "msw"
import { mockUser, mockTokens } from "../../fixtures/user"

const API_URL = "http://localhost:3001"

export const authHandlers = [
  http.post(`${API_URL}/api/auth/login`, async () => {
    return HttpResponse.json({
      user: mockUser,
      ...mockTokens,
    })
  }),

  http.post(`${API_URL}/api/auth/register`, async ({ request }) => {
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

  http.post(`${API_URL}/api/auth/refresh`, async () => {
    return HttpResponse.json(mockTokens)
  }),

  http.post(`${API_URL}/api/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 })
  }),
]
