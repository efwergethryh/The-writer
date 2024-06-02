const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
// const WebSocket = require('ws');

const fs = require('fs');
require('dotenv').config()
const openpgp = require('openpgp');
const { log } = require('console');
const uri = process.env.URI
async function decryptEnv() {
    try {
      const privateKeyArmored = await fs.promises.readFile('private_key.asc', 'utf-8');
      const passphrase = 'MostafaSalam12345!@#$%'; 
      const privateKeyObj = (await openpgp.key.readArmored(privateKeyArmored)).keys[0];
      await privateKeyObj.decrypt(passphrase);
      
      const encryptedData = await fs.promises.readFile('.env.gpg', 'utf-8'); // Read the encrypted data
      const options = {
        message: await openpgp.message.readArmored(encryptedData),
        privateKeys: [privateKeyObj],
      };
      
      const { data: decrypted } = await openpgp.decrypt(options);
      
    } catch (error) {
      console.error('Error decrypting the .env file:', error);
    }
  }
async function connectDatabase() {
  
    try {
        mongoose.connect(uri)
            .then(() => {
                console.log('Connected to MongoDB Atlas');
            })
            .catch(error => {
                console.error('Error connecting to MongoDB Atlas:', error);
            });
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        throw error;
    }
}

const connection = mongoose.connection
module.exports = {
    connection,
    connectDatabase
}