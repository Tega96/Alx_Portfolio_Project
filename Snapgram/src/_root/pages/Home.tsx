import { Loader } from 'lucide-react';
import React from 'react';

const Home = () => {

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
    </div>
  )
}

export default Home