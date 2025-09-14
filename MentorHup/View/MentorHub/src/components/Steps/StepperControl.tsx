interface listControl {
  handleClick: (direction: "next" | "back") => void;
  currentStep: number;
  steps: string[];
}

const StepperControl: React.FC<listControl> = ({
  handleClick,
  currentStep,
  steps,
}) => {
  return (
    <div className="w-full flex justify-between items-center p-2">
      <button
        type="button"
        onClick={() => handleClick("back")}
        className={`bg-[var(--secondary)] text-[var(--primary)] py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-[var(--secondary-dark)] hover:bg-[var(--primary-rgba)] hover:text-white transition duration-200 ease-in-out ${
          currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Back
      </button>
      <button
        type="button"
        onClick={() => handleClick("next")}
        className="bg-[var(--primary)] text-white py-2 px-4 rounded-xl font-semibold cursor-pointer border-2 border-[var(--primary-light)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition duration-200 ease-in-out"
      >
        {currentStep === steps.length ? "Confirm" : "Next"}
      </button>
    </div>
  );
};

export default StepperControl;
