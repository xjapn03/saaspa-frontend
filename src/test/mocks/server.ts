import { setupServer } from "msw/node"
import { authHandlers } from "./handlers/auth"
import { usersHandlers } from "./handlers/users"

export const server = setupServer(...authHandlers, ...usersHandlers)
