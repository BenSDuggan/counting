
import { 
    MongoClient
} from "mongodb"

import { logger } from "./common/logger"
import { config } from "./config"


export const DATABASE_NAME:string = config.db.name ?? "counting";

let uri:string = "";

if(config.db.user === "" && !config.prod) {
    uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";
}
else {
    uri = 'mongodb://' + 
    config.db.user + ':' +
    config.db.pass + '@' + 
    config.db.host + ':' + 
    config.db.port + '/' + 
    config.db.name + '?maxPoolSize=20&w=majority';
}

export const client:MongoClient = new MongoClient(uri); // Create a new MongoClient

// Connect to the db
export const connect = async () => {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
}

// Disconnect from the DB
export const disconnect = async () => {
    await client.close();
}


