import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "../../Context/ThemeContext";
import axios from "axios";
import urlMentor from "../../Utilities/Mentor/urlMentor";

interface dataUser {
  userName: string;
  name: string;
  companyName: string;
  field: string;
  description: string;
  experiences: number;
  price: number;
  stripeAccountId: string;
  skillIds: any[];
}

interface dataEdit {
  onSubmit: (updated: dataUser) => void;
  onclose: () => void;
  open?: boolean;
  data: dataUser;
}

export const ModalEditProfile = ({
  data,
  onSubmit,
  onclose,
  open,
}: dataEdit) => {
  const { isDark } = useTheme();
  const token = localStorage.getItem("accessToken");

  // states for editable fields
  const [nameUser, setUserName] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [fieldUser, setFieldUser] = useState("");
  const [priceS, setPriceS] = useState(0);
  const [descrip, setDescrip] = useState("");
  const [expeYear, setExpeYear] = useState(0);
  const [stripe, setStrip] = useState("");
  // const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  // init states when data changes
  useEffect(() => {
    if (data) {
      setUserName(data.userName || "");
      setName(data.name || "");
      setCompany(data.companyName || "");
      setFieldUser(data.field || "");
      setPriceS(data.price || 0);
      setDescrip(data.description || "");
      setExpeYear(data.experiences || 0);
      setStrip(data.stripeAccountId || "");
      // setSelectedSkillIds(data.skillIds || []);
    }
  }, [data]);

  const handleSave = async () => {
    const updated: dataUser = {
      ...data,
      name,
      userName: nameUser,
      companyName: company,
      field: fieldUser,
      price: priceS,
      description: descrip,
      experiences: expeYear,
      stripeAccountId: stripe,
      // skillIds: selectedSkillIds,
    };

    try {
      const res = await axios.patch(urlMentor.EDIT_PROFILE, updated, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Updated successfully:", res.data);
      onSubmit(res.data);
      onclose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" onClose={onclose}>
        {/* background */}
        <div className="fixed z-50 inset-0 bg-black/50" />

        {/* content */}
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <div
            className={`p-7 rounded w-[38rem] h-[40rem] ${
              isDark ? "bg-[var(--primary-light)]" : "bg-white"
            }`}
          >
            <Dialog.Title
              className={`text-lg font-semibold ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              Edit Profile
            </Dialog.Title>

            <div className="flex flex-col gap-4">
              {/* name + company */}
              <div className="flex flex-row gap-3">
                <div className="flex flex-col w-full gap-2">
                  <label
                    className={`text-start text-base font-medium ${
                      isDark ? "text-gray-200" : "text-[var(--primary)]"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  />
                </div>

                <div className="flex flex-col w-full gap-2">
                  <label
                    className={`text-start text-base font-medium ${
                      isDark ? "text-gray-200" : "text-[var(--primary)]"
                    }`}
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  />
                </div>
              </div>

              {/* field + price */}
              <div className="flex flex-row gap-3">
                <div className="flex flex-col w-full gap-2">
                  <label
                    className={`text-start text-base font-medium ${
                      isDark ? "text-gray-200" : "text-[var(--primary)]"
                    }`}
                  >
                    Field
                  </label>
                  <input
                    type="text"
                    value={fieldUser}
                    onChange={(e) => setFieldUser(e.target.value)}
                    className="flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  />
                </div>

                <div className="flex flex-col w-full gap-2">
                  <label
                    className={`text-start text-base font-medium ${
                      isDark ? "text-gray-200" : "text-[var(--primary)]"
                    }`}
                  >
                    Price per session
                  </label>
                  <input
                    type="number"
                    value={priceS}
                    onChange={(e) => setPriceS(Number(e.target.value))}
                    className="flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  />
                </div>
              </div>

              {/* year + stripe */}
              <div className="flex flex-row gap-3">
                <div className="flex flex-col w-full gap-2">
                  <label
                    className={`text-start text-base font-medium ${
                      isDark ? "text-gray-200" : "text-[var(--primary)]"
                    }`}
                  >
                    Experience year
                  </label>
                  <input
                    type="number"
                    value={expeYear}
                    onChange={(e) => setExpeYear(Number(e.target.value))}
                    className="flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  />
                </div>

                <div className="flex flex-col w-full gap-2">
                  <label
                    className={`text-start text-base font-medium ${
                      isDark ? "text-gray-200" : "text-[var(--primary)]"
                    }`}
                  >
                    Stripe Id
                  </label>
                  <input
                    type="text"
                    value={stripe}
                    onChange={(e) => setStrip(e.target.value)}
                    className="flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  />
                </div>
              </div>

              {/* description */}
              <label
                className={`text-start text-base font-medium ${
                  isDark ? "text-gray-200" : "text-[var(--primary)]"
                }`}
              >
                Description
              </label>
              <textarea
                value={descrip}
                onChange={(e) => setDescrip(e.target.value)}
                className="flex w-full h-32 text-[var(--primary)] rounded-md p-2 border border-[var(--System-Gray-300)] bg-gray-100 focus:outline-none"
              />
            </div>

            <div className="pt-7 flex justify-between">
              <button
                className={`px-2.5 py-2 border border-[#36414f] text-sm rounded-[8px] tracking-wider ${
                  isDark
                    ? "bg-[#36414f] text-white"
                    : "bg-white text-[var(--primary)]"
                }`}
                onClick={onclose}
              >
                Cancel
              </button>
              <button
                className="px-2.5 py-2 font-semibold rounded-[8px] text-sm bg-[#fb2c36] text-white"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
