import { useEffect, useState } from "react";
import Table from "./Table";
import { MdModeEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import urlSkills from "../../Utilities/Skills/urlSkills";
import ModalEdit from "../Modal/ModalEdit";
import type { skills } from "./interfaces";
import ConfirmModal from "../Modal/ModalConfirm";
import Alert from "./alerts";

const TableSkills = () => {
  const token = localStorage.getItem("accessToken")?.trim();
  if (!token) {
    console.log("Not Authorized");
    return;
  }

  const [skill, setSkill] = useState<skills[]>([]);
  const [open, setOpen] = useState(false);
  const [skillEdit, setSkillEdit] = useState<skills>({ id: 0, name: "" });
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [deleteSkill, setDeleteSkill] = useState<skills>({
    id: 0,
    name: "",
    show: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPage = 44;

  useEffect(() => {
    fetchSkills(currentPage, rowsPage);
  }, [currentPage]);

  const fetchSkills = async (page: number, pageSize: number) => {
    const res = await axios.get(urlSkills.SKILLS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { PageNumber: page, PageSize: pageSize },
    });

    console.log(res.data);

    setSkill(res.data.items);
  };

  // edit skill
  const handleEdit = (id: number, name: string) => {
    setOpen(true);
    console.log({ id, name });

    setSkillEdit({ id, name });
  };

  // delete skill
  const handleDelete = (id: number, name: string) => {
    setDeleteSkill({ id, name, show: true });
  };

  const columns = [
    {
      id: "id",
      header: "Skills ID",
      accessor: "id" as keyof skills,
    },
    {
      id: "name",
      header: "Skill Name",
      accessor: "name" as keyof skills,
    },
    {
      id: "id",
      header: "Action",
      accessor: "id" as keyof skills,
      render: (row: skills) => (
        <div className="flex flex-row" key={row.id}>
          <button
            className="p-2 w-9 h-9"
            onClick={() => handleEdit(row.id, row.name)}
          >
            <MdModeEdit className="w-full h-full" />
          </button>
          <button
            onClick={() => handleDelete(row.id, row.name)}
            className="p-2 w-9 h-9"
          >
            <MdDelete className="w-full h-full" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table titleTable="Manage Skills" data={skill} columns={columns} />

      {/* Modal edit skills */}
      <ModalEdit
        open={open}
        value={skillEdit}
        onClose={() => setOpen(false)}
        onConfirm={(updated) => {
          setSkill((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          );
        }}
      />

      {/* Modal delete skills */}
      <ConfirmModal
        open={deleteSkill.show}
        message="Are you sure you want delete this skill?"
        title={`Delete skill: ${deleteSkill.name}`}
        onClose={() => setDeleteSkill((prev) => ({ ...prev, show: false }))}
        onConfirm={async () => {
          try {
            const res = await axios.delete(
              `${urlSkills.SKILLS}/${deleteSkill.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (res.status === 204) {
              setSkill((prev) => prev.filter((id) => id.id !== deleteSkill.id));
              setDeleteSkill((prev) => ({ ...prev, show: false }));
              setMessageSuccess(true);
            }
          } catch (error: any) {
            console.log("Delete skill", error);
          }
        }}
      />

      {/* Alert success */}
      {messageSuccess && (
        <Alert
          open={messageSuccess}
          type="success"
          message="The skill has been successfully deleted"
        />
      )}
    </div>
  );
};

export default TableSkills;
