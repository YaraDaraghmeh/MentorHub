import { StarIcon } from "@heroicons/react/24/solid";

type listProps = {
  rating: number;
};

const StarReview: React.FC<listProps> = ({ rating }) => {
  const listStar = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {listStar.map((star) => (
        <StarIcon
          className={`h-5 w-5 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarReview;
