import { useState } from "react";
import FollowData from "./FollowData";

const StatBlock = ({ value, label, followData }) => {
  const [toShowData, setToShowData] = useState(false);
  return (
    <>
      <div className="flex-center gap-2" onClick={() => setToShowData(true)}>
        <p className="small-semibold lg:body-bold text-primary-500 cursor-pointer">{value}</p>
        <p className="small-medium lg:base-medium text-light-2 cursor-pointer">{label}</p>
      </div>

      {toShowData && <FollowData label={label} onClose={() => setToShowData(false)} followData={followData}/>}
    </>
  );
};

export default StatBlock;
