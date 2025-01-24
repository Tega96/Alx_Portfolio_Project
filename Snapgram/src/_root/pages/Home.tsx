import UserCard from '@/components/ui/shared/UserCard';
import { Loader } from 'lucide-react';
import React from 'react';

const Home = () => {
  // const {
  //   data: posts,
  //   isLoading: isPostLoading,
  //   isError: isPostError, 
  // } = useGetRecentPosts();

  // const {
  //   data: creators,
  //   isLoading: isUserLoading,
  //   isError: isUserError,
  // } = useGetTopCreators(10); // Get top 10 creators, defined in the react query

  // if (isPostError || isUserError) {
  //   return (
  //     <div className="flex flex-1 justify-center items-center">
  //       <h2 className="h2-bold text-center">Something went wrong</h2>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {/* {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="grid 2xl:grid-cols-2 gap-6">
              {creators?.documents.map((creator) => (
                <li key={creator?.$id}>
                  <UserCard user={creator} />
                </li>
              ))}

            </ul>
          )
          } */}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {/* {isUserLoading && !creators ? (
          <Loader />
        ): (
          <ul className="grid 2xl:grind-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )
        } */}
      </div>
    </div>
  );
};

export default Home