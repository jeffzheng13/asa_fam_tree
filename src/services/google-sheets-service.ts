import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from 'google-auth-library';
import path from 'path';
import fs from 'fs';

//read in google creds
// const filePath = process.env.GOOGLE_APP_CREDENTIALS_LOC;
// if (!filePath) {
//   throw new Error('GOOGLE_APP_CREDENTIALS_LOC is not defined');
// }
// const fileContents = fs.readFileSync(filePath, 'utf8');
// JSON.parse
// const serviceAccountAuth = new JWT({email: process.env})