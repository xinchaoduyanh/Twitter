import { Router } from 'express'
import { registerController, loginController } from '~/controllers/users.controllers'
import { accessTokenValidator, loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()
/**
 * Description: Login a new user
 * Path: /register
 * Method: POST
 * Body: {email:string password: string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {name:string, email:string password: string,confirm_password,date_of_birth: ISO8081}
 *
 *
 *
 */

usersRouter.post(
  '/logout',
  accessTokenValidator,
  wrapRequestHandler((req, res) => {
    res.json({ message: 'Logout successfully' })
  })
)
/**
 * Description: Logout a  user
 * Path: /register
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 *
 *
 *
 */
usersRouter.post('/logout', registerValidator, wrapRequestHandler(registerController))
export default usersRouter
