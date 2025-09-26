import { useState } from "react";
import AppForm from "../../../components/Form/Form";
import StepperControl from "../../../components/Steps/StepperControl";
import Stepper from "../../../components/Steps/Stepper";
import Account from "../../../components/formSteps/AcctountInfo";
import ProfileInfo from "../../../components/formSteps/Personal";
import PriceandSkills from "../../../components/formSteps/Price&Skills";
import Available from "../../../components/formSteps/Availabledays";
import { StepperContext } from "../../../Context/StepperContext";
import axios from "axios";
import urlMentor from "../../../Utilities/Mentor/urlMentor";
import { useNavigate } from "react-router-dom";
import type { MentorRegistrationPayload } from "../../../types/types";
import { RiArrowLeftSLine } from "react-icons/ri";

const SignUpMentor = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<any>({});
  const [finalData, setFinalData] = useState<any[]>([]); //defined data such as FormData
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setGeneralError(null);

      // Parse required fields
      const stripeAccountId =
        (userData as any)?.stripeAccountId?.toString().trim() || null;

      // Use numeric skillIds from state when available; fallback to parse comma-separated string
      let skillIds: number[] = [];
      const skillIdsState = (userData as any)?.skillIds;
      if (Array.isArray(skillIdsState)) {
        skillIds = (skillIdsState as any[])
          .map((v) => Number(v))
          .filter((n) => Number.isFinite(n));
      } else if (typeof skillIdsState === "string") {
        skillIds = skillIdsState
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
          .map((s) => Number(s))
          .filter((n) => Number.isFinite(n));
      }

      // availabilities from datetime-local inputs => ISO strings
      const startTimeRaw = (userData as any)?.startTime as string | undefined;
      const endTimeRaw = (userData as any)?.endTime as string | undefined;
      const startTimeIso = startTimeRaw
        ? new Date(startTimeRaw).toISOString()
        : null;
      const endTimeIso = endTimeRaw ? new Date(endTimeRaw).toISOString() : null;

      // Minimal validation for required backend fields
      if (!stripeAccountId) {
        setGeneralError("Stripe Account ID is required.");
        return;
      }
      if (!skillIds || skillIds.length === 0) {
        setGeneralError("At least one Skill ID is required.");
        return;
      }
      if (!startTimeIso || !endTimeIso) {
        setGeneralError("Availability start and end times are required.");
        return;
      }
      if (!(userData as any)?.name?.trim()) {
        setGeneralError("Name is required.");
        return;
      }
      if (!(userData as any)?.email?.trim()) {
        setGeneralError("Email is required.");
        return;
      }
      if (!(userData as any)?.password?.trim()) {
        setGeneralError("Password is required.");
        return;
      }
      if (!(userData as any)?.companyName?.trim()) {
        setGeneralError("Company Name is required.");
        return;
      }
      if (!(userData as any)?.field?.trim()) {
        setGeneralError("Field is required.");
        return;
      }

      // Validate that start time is in the future
      const startDate = new Date(startTimeIso);
      const now = new Date();
      if (startDate <= now) {
        setGeneralError("Availability start time must be in the future.");
        return;
      }

      // Validate that end time is after start time
      const endDate = new Date(endTimeIso);
      if (endDate <= startDate) {
        setGeneralError("Availability end time must be after start time.");
        return;
      }

      // Build payload with required fields
      const payload: MentorRegistrationPayload = {
        name: (userData as any)?.name?.trim() || "",
        field: (userData as any)?.field?.trim() || "",
        companyName: (userData as any)?.companyName?.trim() || "",
        description: (userData as any)?.description?.trim() || "",
        experiences:
          (userData as any)?.experience !== undefined &&
          (userData as any)?.experience !== ""
            ? Number((userData as any)?.experience)
            : 0,
        price:
          (userData as any)?.price !== undefined &&
          (userData as any)?.price !== ""
            ? Number((userData as any)?.price)
            : 0,
        stripeAccountId,
        email: (userData as any)?.email?.trim() || "",
        password: (userData as any)?.password?.trim() || "",
        skillIds,
        availabilities: [
          {
            startTime: startTimeIso,
            endTime: endTimeIso,
          },
        ],
      };

      const res = await axios.post(urlMentor.REGISTER_USER, payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
      });

      console.log("Mentor registration success:", res.data);
      alert(
        "Registration successful! Please verify your email to activate your account, then log in."
      );
      navigate("/login");
    } catch (error: any) {
      if (error.response) {
        const { status, statusText, data } = error.response;
        console.error("Mentor registration failed:", status, statusText, data);
        // Prefer detailed error message if available
        if (typeof data === "string") setGeneralError(data);
        else if (data?.title && data?.errors) setGeneralError(data.title);
        else if (Array.isArray(data?.message) && data.message.length)
          setGeneralError(data.message[0]);
        else setGeneralError("Registration failed. Please check your inputs.");
      } else {
        console.error("Mentor registration failed:", error.message);
        setGeneralError("Network error. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClick = (direction: string) => {
    let newStep = currentStep;

    // check if steps are within bounds
    if (direction === "next") {
      if (currentStep === steps.length) {
        // On final step, submit instead of moving forward
        if (!submitting) void handleSubmit();
        return;
      }
      newStep++;
    } else {
      newStep--;
    }

    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
  };

  return (
    <div className="w-full h-screen flex lg:flex-row flex-col justify-center items-center px-8 py-4 bg-gradient-to-b from-[var(--primary)] from-[0%] via-[var(--teal-950)] via-[80%] to-[var(--cyan-800)] to-[100%]">
      <a
        className="absolute top-5 left-5 text-white cursor-pointer flex flex-row gap-2 underline"
        href="login"
      >
        <RiArrowLeftSLine size={22} /> Sign in
      </a>
      <div className="flex w-full lg:w-[78%]">
        <AppForm title="Sign up" span=" as" span2=" Mentor">
          {generalError && (
            <div className="w-full text-red-600 text-sm py-2" role="alert">
              {generalError}
            </div>
          )}
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
