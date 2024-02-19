
import { 
    MongoClient, 
    type InsertOneResult, 
    type InsertManyResult, 
    type UpdateResult,
    type DeleteResult, 
    type Filter,
    type WithId,
    Document
} from "mongodb"

import { logger } from "./common/logger"
import { settings } from "./common/settings"


export const DATABASE_NAME:string = settings.db.name ?? "counting";

let uri:string = "";

if(settings.db.user === undefined) {
    uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";
}
else {
    uri = 'mongodb://' + 
    settings.db.user + ':' +
    settings.db.pass + '@' + 
    settings.db.host + ':' + 
    settings.db.port + '/' + 
    settings.db.name + '?maxPoolSize=20&w=majority';
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


