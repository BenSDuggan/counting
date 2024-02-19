
import * as fs from "fs";
import * as https from "https";
import { spawn } from "child_process";
import { createInterface } from "readline";

import { MongoClient, Document } from "mongodb";

import { settings } from "../../server/src/common/settings";



const products_url = 'https://static.openfoodfacts.org/data/openfoodfacts-products.jsonl.gz';
const dataSavePath = "../data/products"; // Where to temporarily save the data

const uri = 'mongodb://' + 
    settings.db.user + ':' +
    settings.db.pass + '@' + 
    settings.db.host + ':' + 
    settings.db.port + '/' + 
    settings.db.name + '?maxPoolSize=20&w=majority';

export const client = new MongoClient(uri); // Create a new MongoClient


// Remove old directory and make new one
let manageFolders = () => {
    return new Promise((resolve, reject) => {
        // Delete folder
        if (fs.existsSync(dataSavePath)) {
          fs.rmSync(dataSavePath, { recursive: true })
        }
    
        // Make folder
        if (!fs.existsSync(dataSavePath)){
          fs.mkdirSync(dataSavePath, { recursive: true });
        }
    
        resolve("Download folder managed")
    });
}

// Download the file
// From https://www.geeksforgeeks.org/how-to-download-a-file-using-node-js/
let downloadData = () => {
    return new Promise((resolve) => {
        console.log("Start download");

        https.get(products_url,(res) => {
            const path = `${dataSavePath}/openfoodfacts-products.jsonl.gz`; 
            
            const filePath = fs.createWriteStream(path);
            res.pipe(filePath);
            
            filePath.on('finish',() => {
                filePath.close();
                resolve("Download Completed")
            })
        });
    });
}

// Unzip download
let unzipData = () => {
    return new Promise((resolve) => {
        console.log("Start unzip")
        const child = spawn('gunzip',
                            [`${dataSavePath}/openfoodfacts-products.jsonl.gz`]);
        child.addListener('close', (e) => {
          resolve("Finished unzip")
        });
    });
}

// Remove collection if it exists
async function removeCollection() {
    console.log("Removing collection")

    // Insert hospitals
    return await client.db(settings.db.name).dropCollection("product")
}

// Upload to MongoDB
async function uploadToDB() {
  try {
    console.log("Inserting")

    const fileStream = fs.createReadStream('openfoodfacts-products.jsonl');

    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        let record = JSON.parse(line);
        if(record.countries_tags.includes("en:")) {

        }
    }

    // Insert hospitals
    //const insertManyResult = await client.db(settings.db.name).collection("product").insertMany(helicopters);
    
    //console.log(insertManyResult.acknowledged);
    //console.log(insertManyResult.insertedCount);

    console.log("Uploaded results");
  } catch (e) {
    console.log(e);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    return "Finished uploading"
  }
}

// Run script
client.connect().then((result) => {
    console.log("Connected to database");
//    return manageFolders();
//}).then((result) => {
//  console.log(result);
//  return downloadData()
//}).then((result) => {
//  console.log(result)
//  return unzipData()
}).then((result) => {
  console.log(result)
  return removeCollection()
//}).then((result) => {
//  console.log(result);
//  return uploadToDB(result)
//}).then((results) => {
//  console.log(results)
//  return manageFolders()
}).then((result) => {
    console.log(result)
    console.log("All done")
}).catch(console.error);
