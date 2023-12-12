import {
  useGetRecentPosts,
  useGetUsers,
} from "../../lib/react-query/queriesAndMutations";
import Loader from "../../components/shared/Loader";
import PostCard from "../../components/shared/PostCard";
import UserCard from "../../components/shared/UserCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Home = () => {
  const { ref, inView } = useInView();
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
    fetchNextPage,
    hasNextPage,
  } = useGetRecentPosts();
  const {
    data: creators,
    isPending: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something went wrong.</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something went wrong.</p>
        </div>
      </div>
    );
  }
  // if (isPostLoading) return <Loader />;

  
  const shouldShowPosts = posts?.pages.every(
    (item) => item.documents.length == 0
  );
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {shouldShowPosts ? (
                <p className="text-light-4 mt-10 text-center w-full">
                  End of Posts
                </p>
              ) : (
                posts?.pages.map((item) =>
                  item.documents.map((post) => (
                    <PostCard post={post} key={post.caption} />
                  ))
                )
              )}
            </ul>
          )}
        </div>
        {hasNextPage && (
          <div className="mt-10" ref={ref}>
            <Loader />
          </div>
        )}
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
