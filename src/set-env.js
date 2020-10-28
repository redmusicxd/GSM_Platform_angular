"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var yargs_1 = require("yargs");
// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();
// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
var environment = yargs_1.argv.environment;
var isProd = environment === 'prod';
var targetPath = "./src/environments/environment." + environment + ".ts";
var envConfigFile = `export const environment = {
    production: ${isProd},  
    API_URL: ${isProd ? process.env.API_URL : '\'\''},
};`;
fs_1.writeFile(targetPath, envConfigFile, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Output generated at " + targetPath);
});
