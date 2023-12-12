import { useEffect, useState } from "react";
import {
  useDeleteSavePost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "../../lib/react-query/queriesAndMutations";
import { checkIsLiked } from "../../lib/utils";

const PostStats = ({ post, userId }) => {
  if(!post) return;
  const likesList = post?.likes.map((user) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavePost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record) => record.post.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser])

  const handleLikePost = (e) => {
    e.stopPropagation();

    let newLikesList = [...likes];
    const hasLiked = newLikesList.includes(userId);
    if (hasLiked) {
      newLikesList = newLikesList.filter((id) => id !== userId);
    } else {
      newLikesList.push(userId);
    }

    setLikes(newLikesList);
    likePost({ postId: post?.$id || '', likesArray: newLikesList });
  };
  const handleSavePost = (e) => {
    e.stopPropagation();

    
    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post?.$id || '', userId });
      setIsSaved(true);
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`/assets/icons/${
            checkIsLiked(likes, userId) ? "liked" : "like"
          }.svg`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        <img
          src={`/assets/icons/${isSaved ? "saved" : "save"}.svg`}
          alt="like"
          width={20}
          height={20}
          onClick={handleSavePost}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default PostStats;
