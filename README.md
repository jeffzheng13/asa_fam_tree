# Pitt ASA Family Tree
*Website: [here](https://asa-fam-tree.vercel.app/)*

A project made by me, Jeff Zheng, in Winter of 2025. People often recount their family tree multiple times throughout their journey at Pitt especially during the annual `Big Little Reveal`. The family tree offers an easy way to visualize and get to know the long line of people before you that have made an impact and created this tight-knit community.

## Updating Families
Things to note when updating:

- Don't worry about adding big-littles too many times, the `Connections` sheet will make sure they are unique pairs.
- Make sure if someone has two bigs, only put them under one. Having two will pull in both ancestor graphs and look wonky.

### Steps
1. Navigate to Google Sheets: [here](https://docs.google.com/spreadsheets/d/1Ktc0K4tONu9EYTPMWW-ARsHivnh540f98ZWT5n1x7ZU/edit?usp=sharing)
   1. There are three sheets:
      1. `Connections` (do not edit!)
      2. `ID Name Lookup`
      3. `Add Big-Littles Here`
2. To add new big-little
   1. Go to `Add Big-Littles Here` sheet
   2. Add the little's Pitt ID (or whatever identifier you decide to use) in the first column
   3. Add the big's Pitt ID (or whatever identifier you decide to use) in the second column
   4. Go to `ID Name Lookup`
      1. Add both their Pitt ID (or identifier) you used in `Step 2.2` and `Step 2.3` to the first column.
      2. Add the big/little's name.
   5. Navigate to the website and their names should be there.

## Website Updates
Now if you are a CS major, or you want to help contribute to this website feel free to reach out! This project is meant to be open source and I encourage those who have a vision to contribute. 

This website was built on TS and Vercel using a simple template. If you need Google Sheets access permission, open an issue in GitHub or ask your board member to give you access. 

To get started, clone the project. And to run it `npm run dev` will start project at [http://localhost:3000](http://localhost:3000).

In `src/app/api/connection/route.ts` this is how each families graph is created using the `Connections` sheet data and Union-Find algorithm. In `src/app/api/route.ts`, we get the ID-Name mapping. The bulk of the generated UI is in `src/app/components` and the graph components, using D3.js network library, are at `src/app/custom_components`. 

Good luck, have fun, and I can't wait to see what you make!