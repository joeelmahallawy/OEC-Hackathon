import {
  Box,
  Center,
  Flex,
  Heading,
  Link,
  useForceUpdate,
} from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import HomePage from "../components/home";

const MapWithNoSSR = dynamic(() => import("../components/map"), {
  ssr: false,
});

function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}

const IndexPage = () => {
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [currentCSV, setCurrentCSV] = useState([]);
  const [startNode, setStartNode] = useState();

  function pythagTheorem(x: number, y: number) {
    return Math.sqrt((x ^ 2) + (y ^ 2));
  }

  const [arrayofWaste, setArrayofWaste] = useState([]);

  let arr = [startNode];

  let lowestRiskRecycle = 99999;

  let lowestRiskRecycleCoordinates = [0, 0];

  let lowestRiskLocalFacility = 9999999;

  let lowestRiskLocalCoordinates = [0, 0];

  let differenceBetweenSortingAndRecycle = 99999;

  let differenceBetweenLocalAndWaste = 99999;

  let lowestRecycle;

  let lowestRegionalSort;

  let lowestLocalSort;

  currentCSV[0]?.reverse().forEach((el) => {
    if (el[3] == "regional_recycling_facility") {
      // if node is regional recycle facility
      if (el[5] < lowestRiskRecycle) {
        lowestRiskRecycle = el[5];
        lowestRiskRecycleCoordinates = [el[1], el[2]];
        lowestRecycle = el;
      }
    }

    // if node is regional sorting facility
    if (el[3] == "regional_sorting_facility") {
      if (
        pythagTheorem(
          Math.abs(el[1] - lowestRiskRecycleCoordinates[0]),
          Math.abs(el[2] - lowestRiskRecycleCoordinates[1])
        ) < differenceBetweenSortingAndRecycle
      ) {
        differenceBetweenSortingAndRecycle = pythagTheorem(
          Math.abs(el[1] - lowestRiskRecycle[0]),
          Math.abs(el[2] - lowestRiskRecycle[1])
        );
        lowestRegionalSort = el;
      }
    }
    // find lowest risk local facility
    if (el[3] == "local_sorting_facility") {
      if (el[5] < lowestRiskLocalFacility) {
        lowestRiskLocalFacility = el[5];
        lowestRiskLocalCoordinates = [el[1], el[2]];
        lowestLocalSort = el;
      }
    }
    //
    if (el[3] == "waste") {
      if (
        pythagTheorem(
          Math.abs(el[1] - lowestRiskLocalCoordinates[0]),
          Math.abs(el[2] - lowestRiskLocalCoordinates[1])
        ) < differenceBetweenLocalAndWaste
      ) {
        lowestRiskLocalCoordinates = [el[1], el[2]];
      }
    }
  });
  const forceUpdate = useForceUpdate();
  const endNode = currentCSV[0]?.find((el) => {
    return (
      el[1] == lowestRiskLocalCoordinates[0] &&
      el[2] == lowestRiskLocalCoordinates[1]
    );
  });

  if (endNode && endNode[0] == "0") {
    forceUpdate();
    setArrayofWaste([
      ...currentCSV[0]?.slice(currentCSV[0].length - currentCSV[0].length / 4),
    ]);
  }

  if (arrayofWaste.length > 0) {
    arrayofWaste
      ?.reverse()
      .sort((a, b) => {
        // sort by longitude first
        const sortyByLongitude = a[2] - b[2];
        if (sortyByLongitude) return sortyByLongitude;
        // If there is a tie, sort by latitude
        var sortByLatitude = a[1] - b[1];
        return sortByLatitude;
      })
      .forEach((el) => {
        if (!shallowEqual(el, startNode)) {
          arr.push(el);
        }
      });
    arr.push(lowestLocalSort);
    arr.push(lowestRegionalSort);
    arr.push(lowestRecycle);
  }

  if (process.browser && arr.length > 1 && !showDownloadLink) {
    const finalOutputFile = arr
      ?.map((el, i) => el && el?.join(","))
      .join(`\r\n`);
    const output =
      "data:text/csv;charset=utf-8," + encodeURIComponent(finalOutputFile);
    window.open(output);
    setShowDownloadLink(true);
  }

  return (
    <>
      <Center bg="gray.200" p={5}>
        <Heading>Save Our Oceans</Heading>
      </Center>
      <Center p="1%" flexDir="column">
        <Box mb={5}>
          <input
            type="file"
            onChange={(e) => {
              const reader = new FileReader();
              reader.onload = function (e) {
                const text = e.target.result;
                console.log("some text,", text);
                // @ts-expect-error
                const data = [text.split("\r\n").map((el) => el.split(","))];

                data[0].pop();
                setStartNode(data[0][0]);
                setCurrentCSV([...data]);
              };
              reader.readAsText(e.target.files[0]);
            }}
          />
        </Box>
        {/* {showDownloadLink && <Link>Click here to download CSV file</Link>} */}
        <main>
          <div id="map">
            <MapWithNoSSR coords={arr} />
          </div>
        </main>
      </Center>
    </>
  );
};

export default IndexPage;
