"use client";

import Image from "next/image";
import { ComboboxForm } from "./custom_components/comboboxform";
import { useEffect, useState } from "react";
import FamTree from "./custom_components/d3network";

export default function Home() {
  const [userList, setUserList] = useState([]);
  const [displayGraph, setDisplayGraph] = useState(false);
  const [poiID, setPoiID] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setUserList(data);
      });
  }, []);

  const updateDisplayGraphState = (username: string) => {
    if (poiID === "" || username === "" || !displayGraph) {
      setDisplayGraph(!displayGraph);
    }
    
    setPoiID(username);
  };

  const navigateToWebsite = () => {
    window.open("https://www.pittasa.com")
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/asa_logo.png"
          alt="Pitt ASA logo"
          width={180}
          height={38}
          priority
          onClick={navigateToWebsite}
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Find your ancestor in the dropdown list thru their first and name.
          </li>
          <li>Click the button to visualize your family tree now!</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <ComboboxForm
            data={userList}
            updateState={updateDisplayGraphState}
          ></ComboboxForm>
        </div>

        {/* generate and display graph */}
        {displayGraph ? <div><FamTree poiID={poiID} userIDList={userList} /></div> : null}
      </main>
      <footer className="flex row-start-3 gap-6 flex-wrap items-center justify-center">
        <p>Made with <span style={{ color: "#e25555" }}>❤</span> by <a href="https://github.com/jeffzheng13">Jeffrey Zheng</a></p>
      </footer>
    </div>
  );
}
