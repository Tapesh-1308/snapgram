import { Link } from "react-router-dom";
import { useGetUserById } from "../../lib/react-query/queriesAndMutations";
import FollowBtn from "./FollowBtn";
import Loader from "./Loader";

const AllFollowers = ({ creatorId }) => {
  const { data: creator } = useGetUserById(creatorId || "");
    
  if (!creator) return <Loader />;
  return (
    <li className="flex justify-between w-full mb-4">
      <Link to={`/profile/${creator.$id}`} className="flex items-center gap-3">
        <img
          src={creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
        />
        <div className="flex flex-col gap-1">
          <p className="base-medium lg:body-bold text-lght-1">{creator.name}</p>
          <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
            @{creator.username}
          </p>
        </div>
      </Link>

      <FollowBtn creatorID={creator.$id} />
    </li>
  );
};

export default AllFollowers;
