import Table from "./Table";
import data from "./dataTable.json";
import Eye from "./eyeicon";

interface BookingData {
  id: number;
  name: string;
  date: string;
  duration: string;
  status: string;
  image: string;
}

const MenteeTableBooking = () => {
  const columns = [
    {
      header: "Mentor Name",
      accessor: "name" as const,
      render: (row: any) => {
        return (
          <div className="flex items-center gap-3 justify-start text-start">
            <div className="w-12 h-12">
              <img
                src={row.image}
                className="w-full h-full rounded-full"
                alt="profile"
              />
            </div>
            {row.name}
          </div>
        );
      },
    },
    { header: "Date & time", accessor: "date" as const },
    { header: "Duration", accessor: "duration" as const },
    { header: "Session Type", accessor: "status" as const }, // Using existing status field since 'type' doesn't exist
    {
      header: "Status",
      accessor: "status" as const,
      render: (row: BookingData) => {
        const status = row.status?.trim().toLowerCase();

        const statusColors: Record<string, string> = {
          confirmed: "bg-[var(--secondary-dark)]",
          cancelled: "bg-[var(--red-light)]",
          pending: "bg-[#ffc300]",
        };

        const bgColor = statusColors[status] || "bg-gray-200";

        return (
          <span
            className={`font-semibold p-2 rounded-full text-white ${bgColor}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessor: "id" as const,
      render: () => (
        <div className="flex justify-center items-center">
          <Eye className="w-5 h-5 cursor-pointer" />
        </div>
      ),
    },
  ];
  return (
    <>
      {/* Table Sessions */}
      <div className="py-7 w-full">
        <Table titleTable="My Booked Sessions" data={data} columns={columns} />
      </div>
    </>
  );
};
export default MenteeTableBooking;
