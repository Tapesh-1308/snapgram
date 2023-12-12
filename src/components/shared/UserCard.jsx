import { Link } from "react-router-dom";

import FollowBtn from "./FollowBtn";

const UserCard = ({ creator }) => {
  return (
    <div className="user-card">
      <Link to={`/profile/${creator.$id}`}>
        <img
          src={creator.imageUrl || "/assets/icons/profile-placeholder"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />

        <div className="flex-center flex-col gap-1">
          <p className="base-medium text-light-1 text-enter line-clamp-1">
            {creator.name}
          </p>
          <p className="small-regula text-light-3 text-center line-clamp-1">
            @{creator.username}
          </p>
        </div>
      </Link>
      <FollowBtn creatorID={creator.$id}/>
    </div>
  );
};

export default UserCard;
