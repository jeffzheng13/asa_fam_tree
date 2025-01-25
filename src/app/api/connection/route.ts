import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { NextResponse } from "next/server";

const serviceAccountCredentials = JSON.parse(
  process.env.GOOGLE_SHEETS_CREDENTIALS as string
);
const serviceAccountAuth = new JWT({
  email: serviceAccountCredentials["client_email"],
  key: serviceAccountCredentials["private_key"],
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const googleSheetsId = process.env.GOOGLE_SHEETS_ID as string;
const spreadsheetDoc = new GoogleSpreadsheet(
  googleSheetsId,
  serviceAccountAuth
);

async function retrieveConnectionLinks() {
  await spreadsheetDoc.loadInfo();
  const idNameSheet = spreadsheetDoc.sheetsByTitle["Connections"];
  return await idNameSheet.getRows<Connection>();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ancestor = searchParams.get('poiID');
  console.log(ancestor);
  
  const result = await retrieveConnectionLinks();

  const resultMapped: Connection[] = result.map((x) => ({
    child: x.get("child"),
    parent: x.get("parent"),
  }));

  return NextResponse.json(resultMapped);
}