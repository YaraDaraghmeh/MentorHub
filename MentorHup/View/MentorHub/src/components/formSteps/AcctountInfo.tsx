import FormFiled from "../Form/FormFiled";
import { useContext } from "react";
import { StepperContext } from "../../Context/StepperContext";

const Account = () => {
  const { userData, setUserData } = useContext(StepperContext);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
      {/* inputs */}
      <FormFiled
        onChange={handleChange}
        value={userData["name"] || ""}
        type="text"
        label="Name"
        name="name"
        placeholder="Sara..."
      />
      <FormFiled
        onChange={handleChange}
        value={userData["email"] || ""}
        type="text"
        label="Email"
        name="email"
        placeholder="example@gmail.com"
      />
      <FormFiled
        value={userData["password"] || ""}
        onChange={handleChange}
        type="password"
        label="Password"
        name="password"
        placeholder="***********"
      />
      <FormFiled
        value={userData["stripeAccountId"] || ""}
        onChange={handleChange}
        type="text"
        label="Stripe Account ID"
        name="stripeAccountId"
        placeholder="acct_..."
      />
    </div>
  );
};

export default Account;
