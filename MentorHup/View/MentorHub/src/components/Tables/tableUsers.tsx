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
import Alert from "./alerts";
import ModalProfile from "../Modal/ModalProfile";
import ToSend from "../Chatting/iconsToSend";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: string | number;
  userName: string;
  role: string;
  email: string;
  isDeleted: boolean;
  imageLink: string;
  createdAt: string;
  lockoutEnd?: string | null;
}

interface accoutUser {
  id: string;
  show: boolean;
  alert?: boolean;
}

const TableUser = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [viewProfile, setViewProfile] = useState<accoutUser>({
    id: "",
    show: false,
  });
  // effective
  const [confirmData, setConfirmData] = useState<accoutUser>({
    id: "",
    show: false,
    alert: false,
  });
  // block user
  const [modalBlock, setModalBlock] = useState<accoutUser>({
    id: "",
    show: false,
    alert: false,
  });
  //unblock user
  const [modalUnBlock, setModalUnBlock] = useState<accoutUser>({
    id: "",
    show: false,
    alert: false,
  });
  // restore user
  const [restoreUser, setRestoreUser] = useState<accoutUser>({
    id: "",
    show: false,
    alert: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPage = 130;

  // soft delete
  const removeUser = (id: string, isDeleted: boolean) => {
    if (isDeleted === false) {
      setConfirmData({ id, show: true, alert: false });
    } else {
      setRestoreUser({ id, show: true, alert: false });
    }
  };

  // Block User
  const handleBlock = (id: string, lockoutEnd: string) => {
    if (lockoutEnd === null) {
      setModalBlock({ id, show: true, alert: false });
    } else {
      setModalUnBlock({ id, show: true, alert: false });
    }
  };

  // view profile
  const handleView = (id: string) => {
    setViewProfile({ id: id, show: true });
  };

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

      console.log(res.data.items);
      setUsers(res.data.items);
    } catch (error: any) {
      console.log("Message error:", error);
    }
  };

  const handleMessageClick = (id: string, name: string, image: string) => {
    localStorage.setItem("MessageIdUser", id);
    localStorage.setItem("MessageUserName", name);
    localStorage.setItem("imageUser", image);

    navigate("/admin/chatting");
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
                src={row.imageLink || profile}
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
      render: (row: any) => (
        <div className="flex justify-center items-center gap-2">
          <Eye
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleView(row.id)}
          />
          <MdOutlineBlock
            className="w-5 h-5 cursor-pointer"
            onClick={() => handleBlock(row.id, row.lockoutEnd)}
          />
          {row.role === "Mentor" && (
            <ToSend
              onClick={() =>
                handleMessageClick(
                  row.id,
                  row.userName,
                  row.imageLink || profile
                )
              }
            />
          )}
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
              setConfirmData((prev) => ({ ...prev, show: false, alert: true }));
              setUsers((prev) =>
                prev.map((u) =>
                  u.id == confirmData.id ? { ...u, isDeleted: !u.isDeleted } : u
                )
              );
            }
          } catch (error) {
            console.log("delete user: ", error);
          }
        }}
      />
      {/* alert soft delete */}
      {confirmData.alert && (
        <Alert
          open={confirmData.alert}
          type="success"
          message="User deleted successfully"
        />
      )}

      {/* Modal restore user */}
      <ConfirmModal
        open={restoreUser.show}
        title="Restore User"
        message="This user is temporarily deleted. Do you want to restore this user"
        onClose={() => setRestoreUser((prev) => ({ ...prev, show: false }))}
        onConfirm={async () => {
          try {
            const res = await axios.patch(
              `${urlAdmin.USERSAC}/${restoreUser.id}/restore`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (res.status === 200) {
              setRestoreUser((prev) => ({ ...prev, show: false, alert: true }));
              setUsers((prev) =>
                prev.map((u) =>
                  u.id == restoreUser.id ? { ...u, isDeleted: !u.isDeleted } : u
                )
              );
            }

            console.log("User restored successfully");
          } catch (error) {
            console.log("restore user: ", error);
          }
        }}
      />
      {/* alert restore user */}
      {restoreUser.alert && (
        <Alert
          open={restoreUser.alert}
          type="success"
          message="User restored successfully"
        />
      )}

      {/* Modal block user */}
      <ConfirmModal
        open={modalBlock.show}
        title="Block User"
        message="Are you sure you want to block this user?"
        onClose={() => setModalBlock((prev) => ({ ...prev, show: false }))}
        onConfirm={async () => {
          try {
            const res = await axios.patch(
              `${urlAdmin.USERSAC}/${modalBlock.id}/block`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (res.status === 200) {
              setModalBlock((prev) => ({ ...prev, show: false, alert: true }));
              setUsers((prev) =>
                prev.map((u) =>
                  u.id == modalBlock.id
                    ? { ...u, lockoutEnd: new Date().toISOString() }
                    : u
                )
              );
            }

            console.log("User blocked");
          } catch (error) {
            console.log("delete user: ", error);
          }
        }}
      />
      {/* alert block user */}
      {modalBlock.alert && (
        <Alert
          open={modalBlock.alert}
          type="success"
          message="User blocked successfully"
        />
      )}

      {/* Modal unblock user */}
      <ConfirmModal
        open={modalUnBlock.show}
        title="Unblock User"
        message="Are you sure you want to unblock this user?"
        onClose={() => setModalUnBlock((prev) => ({ ...prev, show: false }))}
        onConfirm={async () => {
          try {
            const res = await axios.patch(
              `${urlAdmin.USERSAC}/${modalUnBlock.id}/unblock`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (res.status === 200) {
              setModalUnBlock((prev) => ({
                ...prev,
                show: false,
                alert: true,
              }));
              setUsers((prev) =>
                prev.map((u) =>
                  u.id == modalUnBlock.id ? { ...u, lockoutEnd: null } : u
                )
              );
            }

            console.log("User unblocked");
          } catch (error) {
            console.log("delete user: ", error);
          }
        }}
      />

      {/* alert unblock user */}
      {modalUnBlock.alert && (
        <Alert
          open={modalUnBlock.alert}
          type="success"
          message="User unblocked successfully"
        />
      )}

      {/* Modal view profile */}
      <ModalProfile
        open={viewProfile.show}
        user={viewProfile.id}
        onClose={() => setViewProfile((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default TableUser;
