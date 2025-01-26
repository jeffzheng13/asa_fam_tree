import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
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

let cachedSheet: GoogleSpreadsheetRow<Connection>[] | null = null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ancestor = searchParams.get("poiID");

  if (ancestor == null) {
    return NextResponse.json(
      { error: "Missing required parameter: poiID" },
      { status: 400 }
    );
  }

  const result = await retrieveConnectionLinks();
  if (result !== cachedSheet) {
    cachedSheet = result;
  } else {
    return NextResponse.json("Success");
  }

  //create union find to group fams
  const uf = new UnionFind();

  result.forEach((x) => {
    const child = x.get("child");
    const parent = x.get("parent");
    uf.add(child);
    uf.add(parent);
    uf.union(child, parent);
  });

  //if person we want to look for doesn't exist
  if (!uf.parent.has(ancestor)) {
    return NextResponse.json({ error: "poiID not found" }, { status: 400 });
  }

  //find the family, input person belongs to
  const famMember = uf.find(ancestor);
  const children: Set<string> = new Set(result.map((x) => x.get("child")));
  const parents: Set<string> = new Set(result.map((x) => x.get("parent")));

  const family: Set<string> = new Set();

  for (const person of children.union(parents)) {
    if (uf.find(person) === famMember) {
      family.add(person);
    }
  }

  //get the root ancestor of the fam
  const roots = parents.difference(children);
  const headOfHouse = family.intersection(roots);
  if (headOfHouse.size !== 1) {
    throw Error("Multiple Root Ancestors!");
  }

  //headOfHouse should be set with one person hence we extract that into head variable
  const head = headOfHouse.values().next().value;

  //directed graph of the fam for easy of traversal
  const singleFamGraph = new Graph();

  result.forEach((x) => {
    if (family.has(x.get("child"))) {
      singleFamGraph.addEdge(x.get("parent"), x.get("child"));
    }
  });

  //define dfs
  function dfs(
    currNode: string,
    visited: Set<string>,
    path: string[],
    paths: string[][]
  ) {
    visited.add(currNode);
    path.push(currNode);
    if (singleFamGraph.getNeighbors(currNode)?.length === 0) {
      paths.push([...path]);
    }

    for (const neighbor of singleFamGraph.getNeighbors(currNode)!) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, visited, path, paths);
      }
    }

    path.pop();
    visited.delete(currNode);
  }

  //run dfs and return result
  const visited: Set<string> = new Set();
  const path: string[] = [];
  const paths: string[][] = [];

  dfs(head!, visited, path, paths);
  console.log(paths);

  return NextResponse.json(paths);
}

class UnionFind {
  parent: Map<string, string>;
  rank: Map<string, number>;

  constructor() {
    this.parent = new Map<string, string>();
    this.rank = new Map<string, number>();
  }

  add(node: string) {
    if (!this.parent.has(node)) {
      this.parent.set(node, node);
      this.rank.set(node, 0);
    }
  }

  union(node1: string, node2: string) {
    const root1 = this.find(node1);
    const root2 = this.find(node2);

    if (root1 !== root2) {
      const rank1 = this.rank.get(root1)!;
      const rank2 = this.rank.get(root2)!;

      if (rank1 > rank2) {
        this.parent.set(root2, root1);
      } else if (rank2 > rank1) {
        this.parent.set(root1, root2);
      } else {
        this.parent.set(root2, root1);
        this.rank.set(root1, rank1 + 1);
      }
    }
  }

  find(node: string) {
    if (this.parent.get(node) !== node) {
      this.parent.set(node, this.find(this.parent.get(node)!));
    }

    return this.parent.get(node)!;
  }
}

class Graph {
  adjList: Map<string, string[]>;

  constructor() {
    this.adjList = new Map();
  }

  addEdge(node1: string, node2: string) {
    if (this.adjList.get(node1) === undefined) {
      this.adjList.set(node1, []);
    }

    if (this.adjList.get(node2) === undefined) {
      this.adjList.set(node2, []);
    }

    this.adjList.get(node1)!.push(node2);
  }

  getNeighbors(node: string) {
    return this.adjList.get(node);
  }
}
