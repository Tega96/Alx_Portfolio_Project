import { Link } from "react-router-dom";
import { Button } from "../button";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link 
      to={`/profile/${user.$id}`} 
      className="user-card">
      <img 
        src={user.imgaeUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-4 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
