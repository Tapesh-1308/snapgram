import { useToast } from "../../components/ui/use-toast";
import { useGetUsers } from "../../lib/react-query/queriesAndMutations";
import Loader from "../../components/shared/Loader";
import UserCard from "../../components/shared/UserCard";

const AllUsers = () => {
  const { data: creators, isPending, isError: isErrorCreators } = useGetUsers();
  const toast = useToast();
  if (isErrorCreators) return toast({ title: "Something went wrong." });

  return (
    <div className="common-container">
      <div className="user-container">
        <h3 className="h3-bold md:h2-bold text-left w-full">All Users</h3>
        {isPending && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard creator={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
