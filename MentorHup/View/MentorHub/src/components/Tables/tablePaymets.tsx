import profile from "../../assets/avatar-profile.png";
import Table from "./Table";
import data from "./payements.json";

interface PaymentData {
  id: number;
  bookingId: number;
  amount: string;
  status: string;
  date: string;
  mentee: string;
  mentor: string;
  image: string | null;
}

const PaymentsInSystem = () => {
  const columns = [
    {
      id: "id",
      header: "Booking ID",
      accessor: "bookingId" as keyof PaymentData,
    },
    {
      id: "mentee",
      header: "Mentee",
      accessor: "mentee" as keyof PaymentData,
      render: (row: PaymentData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.image || profile}
              className="hidden lg:block w-full h-full rounded-full"
              alt="profile"
            />
          </div>
          {row.mentee}
        </div>
      ),
    },
    {
      id: "mentor",
      header: "Mentor",
      accessor: "mentor" as keyof PaymentData,
      render: (row: PaymentData) => (
        <div className="flex items-center gap-3 justify-start text-start">
          <div className="w-12 h-12">
            <img
              src={row.image || profile}
              className="hidden lg:block w-full h-full rounded-full"
              alt="profile"
            />
          </div>
          {row.mentor}
        </div>
      ),
    },
    {
      id: "amount",
      header: "Amount",
      accessor: "amount" as keyof PaymentData,
    },
    {
      id: "status",
      header: "Status",
      accessor: "status" as keyof PaymentData,
      render: (row: PaymentData) => {
        const status = row.status?.trim().toLowerCase();

        const statusColors: Record<string, string> = {
          succeeded: "bg-[var(--secondary-dark)]",
          cancelled: "bg-[var(--red-light)]",
        };

        const bgColor = statusColors[status] || "bg-gray-200";

        return (
          <span
            className={`font-semibold p-2 text-sm rounded-full text-white ${bgColor}`}
          >
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="pt-7 w-full">
      <Table titleTable="Payments" data={data} columns={columns} />
    </div>
  );
};

export default PaymentsInSystem;
