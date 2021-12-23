import React from "react";
import PredTables from "../components/PredTable";
import Tables from "../components/Tables";

function TablesPage() {
  return (
    <>
      <div className="flex flex-row items-center justify-center mt-5">
        <Tables />
      </div>
      <div className="flex flex-row items-center justify-center mt-5">
        <PredTables />
      </div>
    </>
  );
}

export default TablesPage;
