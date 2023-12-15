const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const env = require("dotenv").config();

// const formidable = require("formidable");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const File = require("./models/schema");
const { create } = require("node:domain");

const httpServer = http.createServer();

(async () => {
    try {
        mongoose.connect(
            process.env.URL,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
})();

httpServer.on("request", async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with the specific origin(s) you want to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, email, password, fullname, filename, size, type',);
    
    if (req.url === "/login" && req.method === "GET") {
        const {email, password} = req.body
        try {
            const result = await File.find({Email : email})
            res.writeHead(201, "OooOkay KooOokieE", {
                "Content-Type" : "application/json"
            })
            res.write(JSON.stringify(result))
            res.end();
        } catch (error) {
            res.wrire(JSON.stringify({
                error : error.message
            }))
            res.end();
        }
    }

    if (req.method === "OPTIONS") {
        res.writeHead(200, "Your request has been allowed");
        res.end("Welcome to share it");
    }

    if (req.url === "/upload" && req.method === "POST") {
        handleFileUpload(req, res);
    } 

});




async function handleFileUpload(req, res) {
    let data = [];
    let fileHandler;

    req.on("data", chunk => {
        data.push(chunk);
    });


    req.on("end", async () => {
        const { email, password, fullname, filename } = req.headers;
        const fileData = Buffer.concat(data);

        const createFile = await new File({
            Filename: filename,
            Author: fullname,
            Email: email,
            Password: password,
            DownloadTimes: 0,
            Data: fileData,
        })

        // You can save the file or process the data as needed
        try {
            createFile.save();

            fileHandler = await fs.open(`UPLOADED_FILES${filename}`, "w");
            const WriteStream = fileHandler.createWriteStream();
            WriteStream.write(fileData);

            console.log("The file was created by :", fullname);
            console.log("File saved successfully");

            res.writeHead(201, "You data has been saved", {
                "Content-Type": "application/json"
            })
            res.end(JSON.stringify(createFile))

            await fileHandler.close();
        } catch (error) {
            await fileHandler.close();
            console.error("Error saving file:", error);
            res.writeHead(401, "An Error has been Occured", {
                "Content-Type": "application/json"
            });
            res.end(
                JSON.stringify({
                    message: "An error has been occured",
                    error
                })
            )
        }
    });

}

// IMPORTS FILE USING FORMIDABLE PACKAGE : 

// let formData = new formidable.IncomingForm();

// formData.on("file", async (feilds, file) => {
//     // console.log(file);
//     // console.log(feilds);
//     })

// formData.parse(req, async (err, fields, files) => {
//     if (err) {
//         console.error("Form parsing error:", err);
//         res.statusCode = 500;
//         res.end("Internal Server Error");
//         return;
//     }


//     const openFIle = await fs.open(files.file[0].filepath, "r");
//     const writeFIle = await fs.open(files.file[0].originalFilename, "w");
//     const reader = openFIle.createReadStream();
//     const writer = writeFIle.createWriteStream();
//     reader.pipe(writer); 
// res.end();
// })


httpServer.listen(1234, "127.0.0.1", () => {
    console.info("the server is running", httpServer.address())
})