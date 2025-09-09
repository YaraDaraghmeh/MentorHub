import { createContext, type SetStateAction } from "react";
interface StepperContextType {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  finalData: any[];
  setFinalData: React.Dispatch<React.SetStateAction<any[]>>;
}

const emptyFunction: React.Dispatch<SetStateAction<any>> = () => {};

export const StepperContext = createContext<StepperContextType>({
  userData: {},
  setUserData: emptyFunction,
  finalData: [],
  setFinalData: emptyFunction,
});
