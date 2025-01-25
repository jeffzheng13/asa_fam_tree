"use client";

import Image from "next/image";
import { ComboboxForm } from "./custom_components/comboboxform";
import { useEffect, useState } from "react";

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

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/asa_logo.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Find your ancestor in the dropdown list thru their Pitt email or
            name.
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
        {displayGraph ? <div>{poiID}</div> : null}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
