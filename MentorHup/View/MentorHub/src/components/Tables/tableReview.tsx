import Table from "./Table";
import data from "./review.json";
import profile from "../../assets/avatar-profile.png";
import StarReview from "../Stars/StarReview";

interface ReviewData {
  id: number;
  reviewer: string;
  mentor: string;
  rating: number;
  comment: string;
  createdAt: string;
  image: string | null;
}

const TableReview = () => {
  const columns = [
    {
      id: "id",
      header: "Session ID",
      accessor: "id" as keyof ReviewData,
    },
    {
      id: "reviewer",
      header: "Reviewer",
      accessor: "reviewer" as keyof ReviewData,
      render: (row: ReviewData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.image || profile}
              onError={(e) => (e.currentTarget.src = profile)}
              className="hidden lg:block w-full h-full rounded-full"
              alt="profile"
            />
          </div>
          {row.reviewer}
        </div>
      ),
    },
    {
      id: "mentor",
      header: "Mentor",
      accessor: "mentor" as keyof ReviewData,
    },
    {
      id: "rating",
      header: "Rating",
      accessor: "rating" as keyof ReviewData,
      render: (row: ReviewData) => <StarReview rating={row.rating} />,
    },
    {
      id: "comment",
      header: "Comment",
      accessor: "comment" as keyof ReviewData,
    },
    {
      id: "createdAt",
      header: "Date",
      accessor: "createdAt" as keyof ReviewData,
    },
  ];

  return (
    <div className="pt-7 w-full">
      <Table<ReviewData> titleTable="Reviews" data={data} columns={columns} />
    </div>
  );
};

export default TableReview;
