import { http, HttpResponse } from "msw"
import { mockUser } from "../../fixtures/user"

const API_URL = "http://localhost:3001"

export const usersHandlers = [
  http.get(`${API_URL}/api/users/me`, () => {
    return HttpResponse.json(mockUser)
  }),
]
