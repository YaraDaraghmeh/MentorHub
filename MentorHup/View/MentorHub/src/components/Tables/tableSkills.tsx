import { useEffect, useState } from "react";
import Table from "./Table";
import { MdModeEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import urlSkills from "../../Utilities/Skills/urlSkills";
import ModalEdit from "../Modal/ModalEdit";
import type { skills } from "./interfaces";

const TableSkills = () => {
  const token = localStorage.getItem("accessToken")?.trim();
  if (!token) {
    console.log("Not Authorized");
    return;
  }

  const [skill, setSkill] = useState<skills[]>([]);
  const [open, setOpen] = useState(false);
  const [skillEdit, setSkillEdit] = useState<skills>({ id: 0, skillName: "" });
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

  const handleEdit = (id: number, skillName: string) => {
    setOpen(true);
    const skill = {
      id: id,
      skillName: skillName,
    };

    console.log(skill);

    setSkillEdit(skill);
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
            onClick={() => handleEdit(row.id, row.skillName)}
          >
            <MdModeEdit className="w-full h-full" />
          </button>
          <button className="p-2 w-9 h-9">
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
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
};

export default TableSkills;
