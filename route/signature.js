
import express from 'express'

import { createSignature } from '../controller/api.js'

const router = express.Router()

router.post('/createSignature', createSignature)

export default router