import { Router } from 'express'
import { registerController, userController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, userController)
/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: {name:string, email:string password: string,confirm_password,date_of_birth: ISO8081}
 *
 *
 *
 */

usersRouter.post('/register', registerValidator, registerController)
export default usersRouter
