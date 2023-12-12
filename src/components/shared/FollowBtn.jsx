import { Button } from "../ui/button";
import {
  useFollowedUser,
  useFollowingUser,
  useGetCurrentUser,
  useGetUserById,
} from "../../lib/react-query/queriesAndMutations";
import { checkIsFollowing } from "../../lib/utils";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const FollowBtn = ({ creatorID }) => {
  const { data: creator, isPending: isGettingCreator } = useGetUserById(
    creatorID || ""
  );

  const { data: user, isPending } = useGetCurrentUser();

  const followingsList = user?.followings;
  const followersList = creator?.followers;

  const [followings, setFollowings] = useState(followingsList || []);

  const { mutate: followingUser, isPending: isLoadingFollow } =
    useFollowingUser();
  const { mutate: follwedUser } = useFollowedUser();

  useEffect(() => {
    setFollowings(followingsList || []);
  }, [followingsList]);

  if (isPending || isGettingCreator) return <Loader />;

  const handleFollowBtn = (e) => {
    e.stopPropagation();

    let newFollowingList = [...followingsList];
    let newFollowersList = [...followersList];

    const hasFollowed = newFollowingList.includes(creatorID);

    if (hasFollowed) {
      newFollowingList = newFollowingList.filter((id) => id !== creatorID);
      newFollowersList = newFollowersList.filter((id) => id !== user.$id);
    } else {
      newFollowingList.push(creatorID);
      newFollowersList.push(user.$id);
    }
    followingUser({
      userId: user?.$id || "",
      followingsArray: newFollowingList,
    });

    follwedUser({
      userId: creatorID || "",
      followersArray: newFollowersList,
    });
    setFollowings(newFollowingList);
  };

  return (
    <Button
      type="button"
      size="sm"
      className={`shad-button_primary px-5 ${
        checkIsFollowing(followings, creatorID) && "shad-button_dark_4"
      } ${user && user.$id === creatorID && "invisible"} `}
      onClick={(e) => handleFollowBtn(e)}
    >
      {isLoadingFollow ? (
        <Loader />
      ) : checkIsFollowing(followings, creatorID) ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
};

export default FollowBtn;
