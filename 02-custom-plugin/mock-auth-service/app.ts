import express from 'express'
import helmet from 'helmet'
import zod from 'zod'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import dayjs from 'dayjs'
import morgan from 'morgan'

interface User {
  id: number
  username: string
  password?: string
}

interface ResponseErrorDetail {
  property: string
  message: string
}

interface AccessTokenPayload {
  id: number
  exp: number
}

const USERS: Array<User> = [
  { id: 1, username: 'user01', password: 'user01' }
]

const ACCESS_TOKEN_PRIVATE_KEY = 'auth'

const findUserByUsername = (username: string, password: string): User | undefined => {
  return USERS.find((item) => item.username === username && item.password === password)
}

const findUserById = (id: number): User | undefined => {
  return USERS.find((item) => item.id === id)
}

const generateAccessToken = (id: number): [string, number] => {
  const current = dayjs()
  const expIn = 7 * 24 * 60 * 60
  const exp = current.clone().add(expIn, 'seconds')
  const payload: AccessTokenPayload = {
    id,
    exp: exp.unix()
  }
  return [jwt.sign(payload, ACCESS_TOKEN_PRIVATE_KEY, { algorithm: 'HS256' }), exp.unix()]
}

const buildResponseError = (res: Response, message: string | object, statusCode: number = 400) => {
  const body = typeof message === 'string' ? { message } : message
  res.status(statusCode).json(body)
}

const app = express()
app.use(
  express.urlencoded({
    extended: true,
    limit: '25mb',
  })
)
app.use(
  express.json({
    limit: '25mb',
  })
)
app.use(helmet())
app.use(morgan('combined'))

app.post('/auth/login', (req: Request, res: Response, next: NextFunction) => {
  try {
    const validator = zod.object({
      username: zod.string({ required_error: 'username is required.' }),
      password: zod.string({ required_error: 'password is required.' }),
    })
    const result = validator.safeParse(req.body)
    if (!result.success) {
      const details: Array<ResponseErrorDetail> = result.error.issues.map((error) => {
        return { property: String(error.path[0]), message: error.message }
      })
      buildResponseError(res, { message: `The request body has ${details.length} error(s)`, details })
      return
    }

    const { username, password } = result.data
    const user = findUserByUsername(username, password)
    if (!user) {
      buildResponseError(res, 'Invalid username or password.')
      return
    }

    const [token, exp] = generateAccessToken(user.id)
    res.json({ access_token: token, expires_in: exp })
  } catch (error) {
    next(error)
  }
})

app.post('/auth/verify', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      buildResponseError(res, 'Authorization header required. Must follow the scheme, \'Authorization: Bearer <ACCESS TOKEN>\'', 401)
      return
    }
    const access_token = authorization.replace('Bearer ', '')

    const result = jwt.verify(String(access_token), ACCESS_TOKEN_PRIVATE_KEY) as AccessTokenPayload
    if (!result) {
      buildResponseError(res, 'Invalid access token.')
      return
    }
    res.json({ expires_in: result.exp })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      buildResponseError(res, 'Invalid access token.')
      return
    } else if (error instanceof TokenExpiredError) {
      buildResponseError(res, 'access token expired.')
      return
    }
    next(error)
  }
})

app.post('/auth/me', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      buildResponseError(res, 'Authorization header required. Must follow the scheme, \'Authorization: Bearer <ACCESS TOKEN>\'', 401)
      return
    }
    const access_token = authorization.replace('Bearer ', '')
    const result = jwt.verify(String(access_token), ACCESS_TOKEN_PRIVATE_KEY) as AccessTokenPayload
    if (!result) {
      buildResponseError(res, 'Invalid access token.')
      return
    }

    const user = findUserById(result.id)
    if (!user) {
      buildResponseError(res, 'You need permission.', 403)
      return
    }
    delete user.password
    res.json({ ...user, expires_in: result.exp })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      buildResponseError(res, 'Invalid access token.')
      return
    } else if (error instanceof TokenExpiredError) {
      buildResponseError(res, 'access token expired.')
      return
    }
    next(error)
  }
})

app.get('/mock/info', (req: Request, res: Response) => {
  const headers = req.headers
  const query = req.query
  const body = req.body
  res.json({
    headers,
    query,
    body
  })
})

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'path not found'
  })
})

app.use((_error: Error, _req: Request, res: Response) => {
  res.status(500).json({
    message: 'Something went wrong. Please try again.'
  })
})

app.listen(3000, () => {
  console.log('Server listening 3000')
})

