import "./Form.css";

type ListItemProps = {
  children: React.ReactNode;
  title: string;
  span: string;
  span2?: string;
};

const AppForm = ({ children, span, span2, title }: ListItemProps) => {
  return (
    <form className="flex flex-col w-full justify-center self-stretch items-center w-full gap-4">
      <div className="flex">
        <h2 className="text-3xl font-bold text-[var(--primary)]">
          {title}
          <span className="interview">{span}</span>
          <span>{span2}</span>
        </h2>
      </div>
      <div className="flex flex-wrap justify-between items-start gap-4 w-full">
        {children}
      </div>
    </form>
  );
};

export default AppForm;
