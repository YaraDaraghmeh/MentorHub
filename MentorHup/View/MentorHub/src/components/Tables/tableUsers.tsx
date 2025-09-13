import { useTheme } from "../../Context/ThemeContext";
import Eye from "./eyeicon";
import Table from "./Table";
import data from "./dataUsers.json";
import { useState } from "react";
import ConfirmModal from "../Modal/ModalConfirm";

const TableUser = () => {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const removeUser = () => {
    setShowModal(true);
  };

  const colums = [
    {
      header: "Name",
      accessor: "name",
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
    {
      header: "Role",
      accessor: "role",
    },
    { header: "Email", accessor: "email" },
    {
      header: "Active",
      accessor: "status",
      render: (row: any) => (
        <>
          <button
            className={`relative pl-[2px] inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
              row.status === "true" && isDark
                ? "bg-[var(--secondary)]"
                : row.status === "false" && isDark
                ? "bg-[var(--gray-dark)]"
                : row.status === "true" && !isDark
                ? "bg-[var(--gray-light)]"
                : "bg-[var(--secondary)]"
            }`}
            onClick={removeUser}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 ${
                row.status === "true"
                  ? "translate-x-6 bg-[var(--primary)]"
                  : "translate-x-0 bg-[var(--secondary-light)]"
              }`}
            />
          </button>
        </>
      ),
    },
    {
      header: "Action",
      accessor: "id",
      render: () => (
        <div className="flex justify-center items-center">
          <Eye className="w-5 h-5 cursor-pointer" />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="py-7 w-full">
        <Table titleTable="Users" data={data} columns={colums} />
      </div>

      {/* Modal */}
      <ConfirmModal
        open={showModal}
        title="Delete User"
        message="Are you sure about the deletion process?"
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
        }}
      />
    </>
  );
};

export default TableUser;
