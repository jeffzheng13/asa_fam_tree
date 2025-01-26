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

async function retrieveNameIDs() {
  await spreadsheetDoc.loadInfo();
  const idNameSheet = spreadsheetDoc.sheetsByTitle["ID Name Lookup"];
  return await idNameSheet.getRows<UserID>();
}

export async function GET() {
  const result = await retrieveNameIDs();
  //   const resultMapped = result.reduce(
  //     (acc: { [key: string]: string }, x: any) => {
  //       acc[x.get("id")] = x.get("name");
  //       return acc;
  //     },
  //     {}
  //   );
  const resultMapped: UserID[] = result.map((x) => ({
    id: x.get("id"),
    name: x.get("name"),
  }));

  return NextResponse.json(resultMapped.sort((a, b) => a.name.localeCompare(b.name)));
  
}

// function union() {}

// function find() {}
