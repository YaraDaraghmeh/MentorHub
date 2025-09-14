import { useState } from "react";
import AppForm from "../../../components/Form/Form";
import StepperControl from "../../../components/Steps/StepperControl";
import Stepper from "../../../components/Steps/Stepper";
import Account from "../../../components/formSteps/AcctountInfo";
import ProfileInfo from "../../../components/formSteps/Personal";
import PriceandSkills from "../../../components/formSteps/Price&Skills";
import Available from "../../../components/formSteps/Availabledays";
import { StepperContext } from "../../../Context/StepperContext";

const SignUpMentor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState("");
  const [finalData, setFinalData] = useState<any[]>([]); //defined data such as FormData

  const steps = [
    "Account Info",
    "Profile Info",
    "Pricing & Skills",
    "Availability",
  ];

  const displayInputs = (step: number) => {
    switch (step) {
      case 1:
        return <Account />;
      case 2:
        return <ProfileInfo />;
      case 3:
        return <PriceandSkills />;
      case 4:
        return <Available />;
      default:
    }
  };
  const handleSi = () => {
    console.log("test");
  };

  const handleClick = (direction: string) => {
    let newStep = currentStep;

    // check if steps are within bounds
    direction === "next" ? newStep++ : newStep--;

    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  return (
    <div className="w-full h-screen flex lg:flex-row flex-col justify-center items-center px-8 py-4 bg-gradient-to-b from-[var(--primary)] from-[0%] via-[var(--teal-950)] via-[80%] to-[var(--cyan-800)] to-[100%]">
      <div className="flex w-full lg:w-[78%]">
        <AppForm title="Sign up" span=" as" span2=" Mentor" onSubmit={handleSi}>
          <Stepper steps={steps} currentStep={currentStep} />
          <div className="w-full">
            <StepperContext.Provider
              value={{ userData, setUserData, finalData, setFinalData }}
            >
              {displayInputs(currentStep)}
            </StepperContext.Provider>
          </div>
          <StepperControl
            handleClick={handleClick}
            currentStep={currentStep}
            steps={steps}
          />
        </AppForm>
      </div>
    </div>
  );
};

export default SignUpMentor;
