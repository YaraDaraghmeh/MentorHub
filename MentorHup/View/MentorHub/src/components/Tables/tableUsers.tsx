import { useTheme } from "../../Context/ThemeContext";
import Eye from "./eyeicon";
import Table from "./Table";
import { useEffect, useState } from "react";
import ConfirmModal from "../Modal/ModalConfirm";
import profile from "../../assets/avatar-profile.png";
import axios from "axios";
import urlAdmin from "../../Utilities/Admin/urlAdmin";
import FormateDate from "./date";
import { MdOutlineBlock } from "react-icons/md";

interface UserData {
  id: string | number;
  userName: string;
  role: string;
  email: string;
  isDeleted: boolean;
  image: string;
  createdAt: string;
}

const TableUser = () => {
  const { isDark } = useTheme();
  const [users, setUsers] = useState<UserData[]>([]);
  // effective
  const [confirmData, setConfirmData] = useState<{ id: string; show: boolean }>(
    { id: "", show: false }
  );
  // block user
  const [modalBlock, setModalBlock] = useState<{ id: string; show: boolean }>({
    id: "",
    show: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPage = 130;

  // soft delete
  const removeUser = (id: string, isDeleted: boolean) => {
    if (isDeleted === false) {
      setConfirmData({ id, show: true });
    }
    // else{
    //alert message
    // }
  };

  // const handleBlock = (id: string) => {};

  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.log("Not Authorized");
    return;
  }

  useEffect(() => {
    getUsers(currentPage, rowsPage);
  }, [currentPage]);

  const getUsers = async (page: number, pageSize: number) => {
    try {
      const res = await axios.get(urlAdmin.USERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { PageNumber: page, PageSize: pageSize },
      });

      // console.log(res.data);
      setUsers(res.data.items);
    } catch (error: any) {
      console.log("Message error:", error);
    }
  };

  const colums = [
    {
      id: "userName",
      header: "Name",
      accessor: "userName" as keyof UserData,
      render: (row: any) => {
        return (
          <div className="flex items-center gap-3 justify-start text-start">
            <div className="w-12 h-12">
              <img
                src={row.image || profile}
                className="hidden lg:block w-full h-full rounded-full"
                alt="profile"
              />
            </div>
            {row.userName}
          </div>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      accessor: "role" as keyof UserData,
    },
    {
      id: "createdAt",
      header: "Created At",
      accessor: "createdAt" as keyof UserData,
      render: (row: any) => <>{FormateDate(row.createdAt)}</>,
    },
    { id: "email", header: "Email", accessor: "email" as keyof UserData },
    {
      id: "isDeleted",
      header: "Effective",
      accessor: "isDeleted" as keyof UserData,
      render: (row: any) => (
        <>
          <button
            className={`relative px-[2px] inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
              row.isDeleted === false && isDark
                ? "bg-[var(--secondary)] justify-end"
                : row.isDeleted === true && isDark
                ? "bg-[var(--gray-dark)] justify-start"
                : row.isDeleted === false && !isDark
                ? "bg-[var(--secondary)] justify-end"
                : "bg-[var(--gray-light)] justify-start"
            }`}
            onClick={() => removeUser(row.id, row.isDeleted)}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 ${
                row.isDeleted === "true"
                  ? "translate-x-6 bg-[var(--primary)]"
                  : "translate-x-0 bg-[var(--secondary-light)]"
              }`}
            />
          </button>
        </>
      ),
    },
    {
      id: "id",
      header: "Action",
      accessor: "id" as keyof UserData,
      render: () => (
        <div className="flex justify-center items-center gap-2">
          <Eye className="w-5 h-5 cursor-pointer" />
          <MdOutlineBlock
            className="w-5 h-5 cursor-pointer"
            // onClick={() => handleBlock(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="py-7 w-full">
        <Table titleTable="Users" data={users} columns={colums} />
      </div>

      {/* Modal soft delete */}
      <ConfirmModal
        open={confirmData.show}
        title="Delete User"
        message="Are you sure you want to perform this action?"
        onClose={() => setConfirmData((prev) => ({ ...prev, show: false }))}
        onConfirm={async () => {
          try {
            const res = await axios.delete(
              `${urlAdmin.USERSAC}/${confirmData.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (res.status === 200) {
              setConfirmData((prev) => ({ ...prev, show: false }));
              setUsers((prev) =>
                prev.map((u) =>
                  u.id == confirmData.id ? { ...u, isDeleted: !u.isDeleted } : u
                )
              );
            }

            console.log("User deleted successfully");
          } catch (error) {
            console.log("delete user: ", error);
          }
        }}
      />

      {/* Modal block user */}
      <ConfirmModal
        open={modalBlock.show}
        title="Block User"
        message="Are you sure you want to perform this action?"
        onClose={() => setModalBlock((prev) => ({ ...prev, show: false }))}
        onConfirm={async () => {
          try {
            const res = await axios.delete(
              `${urlAdmin.USERSAC}/${modalBlock.id}/block`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // if (res.status === 200) {
            //   setModalBlock((prev) => ({ ...prev, show: false }));
            //   setUsers((prev) =>
            //     prev.map((u) =>
            //       u.id == confirmData.id ? { ...u, isDeleted: !u.isDeleted } : u
            //     )
            //   );
            // }

            console.log("User blocked successfully");
          } catch (error) {
            console.log("delete user: ", error);
          }
        }}
      />
    </>
  );
};

export default TableUser;
