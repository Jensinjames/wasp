import jwt from 'jsonwebtoken'
import util from 'util'

import config from 'wasp/server/config'

const jwtSign = util.promisify(jwt.sign)
const jwtVerify = util.promisify(jwt.verify)

const JWT_SECRET = config.auth.jwtSecret

export const signData = (data, options) => jwtSign(data, JWT_SECRET, options)
export const verify = (token) => jwtVerify(token, JWT_SECRET)
