import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.body)

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      message: 'Missing email or songthing else'
    })
  }
  next()
}
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isLength: {
        options: {
          max: 100,
          min: 1
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value) => {
          const result = await usersService.checkEmailExist(value)
          if (result) {
            throw new Error('Email is already exist')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          max: 50,
          min: 6
        }
      },
      isStrongPassword: {
        options: {
          minSymbols: 1,
          minLowercase: 1,
          minUppercase: 1,
          minLength: 6,
          minNumbers: 1
        },
        errorMessage:
          'Your password must include at least one symbol, one uppercase letter, one lowercase letter, and one number.'
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          max: 50,
          min: 6
        }
      },
      isStrongPassword: {
        options: {
          minSymbols: 1,
          minLowercase: 1,
          minUppercase: 1,
          minLength: 6,
          minNumbers: 1
        },
        errorMessage:
          'Your password must include at least one symbol, one uppercase letter, one lowercase letter, and one number.'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true
        }
      }
    }
  })
)
