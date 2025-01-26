import React, { useEffect, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";

export default function FamTree({
  poiID,
  userIDList,
}: {
  poiID: string;
  userIDList: { id: string; name: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<string[]>([]);
  useEffect(() => {
    const processedUserIDList = userIDList.reduce((acc, x) => {
      acc[x.id] = x.name;
      return acc;
    }, {} as { [key: string]: string });

    fetch("/api/connection?" + new URLSearchParams({ poiID: poiID }))
      .then((response) => response.json())
      .then((data: string[][]) => {
        const processedData: string[] = data.map((element) => {
          element = element.map((id) => processedUserIDList[id]);
          return element.join("/");
        });
        
        setData(processedData.sort());
      });
  }, [poiID, userIDList]);

  useEffect(() => {
    if (data === undefined || data.length === 0) return;
    console.log(data);
    const plot = Plot.plot({
      axis: null,
      margin: 10,
      marginLeft: 120,
      marginRight: 120,
      marks: [Plot.tree(data, { delimiter: "/" })],
    });
    if (containerRef.current) {
      containerRef.current.append(plot);
    }
    return () => plot.remove();
  }, [data]);

  return <div ref={containerRef}></div>;
}
