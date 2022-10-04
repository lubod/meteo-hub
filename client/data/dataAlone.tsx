import React from "react";
import Data from "./data";

type DataProps = {
  label: string;
  value: number;
  unit: string;
  fix: number;
};

function DataAlone ({ label, value, unit, fix }: DataProps) {
  return (
    <div className="text-left my-2">
      <Data label={label} value={value} unit={unit} fix={fix} />
    </div>
  );
};

export default DataAlone;
