

import { logger } from './common/logger'
import { config } from  './config'

logger.info("Server started. Mode="+(config.prod?"Prod":"Dev"))

import './web'
