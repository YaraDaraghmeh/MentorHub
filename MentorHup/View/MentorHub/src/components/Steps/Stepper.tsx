import { useEffect, useState, useRef } from "react";
import { Check } from "lucide-react";

interface listSteps {
  steps: string[];
  currentStep: number;
}

interface StepState {
  description: string;
  completed: boolean;
  highlighted: boolean;
  selected: boolean;
}

const Stepper = ({ steps, currentStep }: listSteps) => {
  const [newStep, setNewStep] = useState<StepState[]>([]);
  const stepRef = useRef<StepState[]>([]);

  const updateStep = (stepNumber: number, steps: StepState[]) => {
    const newSteps = [...steps];
    let count = 0;

    while (count < newSteps.length) {
      // current step
      if (count === stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: true,
          selected: true,
          completed: true,
        };
        count++;
      }
      // step completed
      else if (count < stepNumber) {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: true,
          completed: true,
        };
        count++;
      }
      // step pendin
      else {
        newSteps[count] = {
          ...newSteps[count],
          highlighted: false,
          selected: false,
          completed: false,
        };
        count++;
      }
    }
    return newSteps;
  };
  useEffect(() => {
    const stepsState = steps.map((step: string, index: number) =>
      Object.assign(
        {},
        {
          description: step,
          completed: false,
          highlighted: index === 0 ? true : false,
          selected: index === 0 ? true : false,
        }
      )
    );

    stepRef.current = stepsState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  const displaySteps = newStep.map((step: StepState, index: number) => {
    return (
      <div
        key={index}
        className={
          index != newStep.length - 1
            ? "w-full flex items-center"
            : "flex items-center"
        }
      >
        {/* Steps  */}
        <div className="relative flex flex-col items-center text-teal-600">
          <span
            className={`rounded-full transition duration-500 ease-in-out w-12 h-12 border-2 border-teal-600 flex items-center justify-center py-3${
              step.selected ? " bg-[var(--primary)]" : ""
            }`}
          >
            {step.completed ? (
              <span className="text-white font-bold text-xl">
                <Check />
              </span>
            ) : (
              index + 1
            )}
          </span>
          <h3
            className={`absolute top-0 text-center pt-16 w-32 text-xs font-meduim ${
              step.highlighted
                ? "text-gray-900"
                : "text-[var(--System-Gray-400)]"
            }`}
          >
            {step.description}
          </h3>
        </div>
        <div
          className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
            step.completed
              ? "border-[var(--primary)]"
              : "border-[var(--System-Gray-300)]"
          }`}
        ></div>
      </div>
    );
  });

  return (
    <div className="p-4 flex justify-between items-center w-full">
      {displaySteps}
    </div>
  );
};

export default Stepper;
