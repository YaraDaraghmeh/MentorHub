import "./Form.css";

type ListItemProps = {
  children: React.ReactNode;
  title: string;
  span: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const AppForm = ({ children, span, title, onSubmit }: ListItemProps) => {
  return (
    <form
      className="flex flex-col w-full justify-center self-stretch items-center w-full gap-4"
      onSubmit={onSubmit}
    >
      <div className="flex">
        <h2 className="text-3xl font-bold">
          {title}
          <span>{span}</span>
        </h2>
      </div>
      <div className="flex flex-wrap justify-between items-start gap-4 w-full">
        {children}
      </div>
    </form>
  );
};

export default AppForm;
