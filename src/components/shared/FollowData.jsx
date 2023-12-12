import { Button } from "../ui/button";
import AllFollowers from "./AllFollowers";

const FollowData = ({ label, onClose, followData = [] }) => {
  return (
    <div className="post_details-container absolute w-full bg-dark-3 rounded-3xl max-w-[700px]  top-1/2 -translate-y-12">
      <div className="flex w-full justify-between">
        <h2 className="h3-bold md:h2-bold text-left w-full">{label}</h2>
        <Button
          type="button"
          className="rounded-full shad-button_dark_4 border border-white/40"
          onClick={onClose}
        >
          X
        </Button>
      </div>
      <hr className="border w-full border-white/10" />

      <div className="w-full max-h-[500px] overflow-y-auto custom-scrollbar">
        {followData.length === 0 ? (
          <p className="text-light-4 mt-10 text-center w-full">
            Nothing to show
          </p>
        ) : (
          <ul className="flex flex-1 flex-col mx-2 lg:mx-4">
            {followData.map((id) => (
              <AllFollowers key={id} creatorId={id} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FollowData;
