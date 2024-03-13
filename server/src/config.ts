
import { readFileSync } from 'fs'

import { logger } from './common/logger'

const SETTINGS_FILE_PATH = "../data/settings.json";


interface database_config_type {
    host:string,
    port:string,
    user:string,
    pass:string,
    name:string
}

interface config_type {
    prod: boolean,
    port: string,
    db: database_config_type
}

let db:database_config_type = {
    "host":process.env.DB_HOST ?? "localhost",
    "port":"27017",
    "user":process.env.DB_USER ?? "",
    "pass":process.env.DB_PASS ?? "",
    "name":"counting"
}

if(!(process.env.DB_USER ?? process.env.DB_PASS ?? false)) {
    // Try to load database config from file if not in environment variable
    try {
        const db_settings = JSON.parse(readFileSync(SETTINGS_FILE_PATH, 'utf8'));   
        db.host = db_settings.db.host;
        db.user = db_settings.db.user;
        db.pass = db_settings.db.pass;
        logger.info("Using database config from `settings.json`")
    } catch (error) {
        logger.error("Could not find database config.")
    }
}

export const config:config_type = {
    "prod":process.env.COUNTING_PROD == "true" ?? false,
    "port":process.env.COUNTING_PORT ?? "4000",
    "db": db
}
