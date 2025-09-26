import Table from "./Table";
import profile from "../../assets/avatar-profile.png";
import StarReview from "../Stars/StarReview";
import FormateDate from "./date";
import { useEffect, useState } from "react";
import Alert from "./alerts";
import axios from "axios";
import urlReview from "../../Utilities/Review/urlReview";

interface ReviewData {
  id: number;
  bookingId: number;
  mentorName: string;
  menteeName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  menteeImage: string | null;
  mentorImage: string | null;
}

const TableReview = () => {
  const [messageError, setMessageError] = useState(false);
  const [reviews, setreviews] = useState<ReviewData[]>([]);
  let comments = "No comment";
  const columns = [
    {
      id: "bookingId",
      header: "Session ID",
      accessor: "bookingId" as keyof ReviewData,
    },
    {
      id: "menteeName",
      header: "Reviewer",
      accessor: "menteeName" as keyof ReviewData,
      render: (row: ReviewData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.menteeImage || profile}
              onError={(e) => (e.currentTarget.src = profile)}
              className="hidden lg:block w-full h-full rounded-full"
              alt="profile"
            />
          </div>
          {row.menteeName}
        </div>
      ),
    },
    {
      id: "mentorName",
      header: "Mentor",
      accessor: "mentorName" as keyof ReviewData,
      render: (row: ReviewData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.mentorImage || profile}
              onError={(e) => (e.currentTarget.src = profile)}
              className="hidden lg:block w-full h-full rounded-full"
              alt="profile"
            />
          </div>
          {row.mentorName}
        </div>
      ),
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
      render: (row: ReviewData) => <>{row.comment || comments}</>,
    },
    {
      id: "createdAt",
      header: "Date",
      accessor: "createdAt" as keyof ReviewData,
      render: (row: ReviewData) => <>{FormateDate(row.createdAt)}</>,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessageError(true);
      return;
    }

    const getreview = async () => {
      try {
        const res = await axios.get(urlReview.GET_ALL_REVIEWS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API response:", res.data);
        setreviews(res.data.items ?? res.data);
      } catch (error: any) {
        console.error("Error fetching reviews:", error);
      }
    };

    getreview();
  }, []);

  return (
    <>
      <div className="pt-7 w-full">
        <Table titleTable="Reviews" data={reviews} columns={columns} />
      </div>

      {/* alert error */}
      {messageError && (
        <Alert open={messageError} type="error" message="Not Authorized!" />
      )}
    </>
  );
};

export default TableReview;
