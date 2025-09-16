import Table from "./Table";
import { MdModeEdit, MdDelete } from "react-icons/md";

interface skills {
  id: number;
  skillName: string;
}

const TableSkills = () => {
  const data: skills[] = [
    { id: 1, skillName: "QA" },
    { id: 2, skillName: "Frontend" },
    { id: 3, skillName: ".Net C#" },
  ];

  const columns = [
    {
      id: "id",
      header: "Skills ID",
      accessor: "id" as keyof skills,
    },
    {
      id: "name",
      header: "Skill Name",
      accessor: "skillName" as keyof skills,
    },
    {
      id: "action",
      header: "Action",
      accessor: "id" as keyof skills,
      render: (row: skills) => (
        <div className="flex fex-row">
          <button className="p-2 w-9 h-9">
            <MdModeEdit className="w-full h-full" />
          </button>
          <button className="p-2 w-9 h-9">
            <MdDelete key={row.id} className="w-full h-full" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table titleTable="Manage Skills" data={data} columns={columns} />
    </div>
  );
};

export default TableSkills;
