import { http, HttpResponse } from "msw"
import { mockUser } from "../../fixtures/user"

export const usersHandlers = [
  http.get("/api/users/me", () => {
    return HttpResponse.json(mockUser)
  }),
]
