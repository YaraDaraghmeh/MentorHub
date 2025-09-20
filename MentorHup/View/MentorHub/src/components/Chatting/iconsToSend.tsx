import { TbMessageCircleFilled } from "react-icons/tb";

interface sendeProps {
  onClick: () => void;
}

const ToSend = ({ onClick }: sendeProps) => {
  const token = localStorage.getItem("accessToken");

  return (
    <>
      <TbMessageCircleFilled className="cursor-pointer" onClick={onClick} />
    </>
  );
};

export default ToSend;
