import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useTheme } from "../../Context/ThemeContext";
import axios from "axios";
import profile from "../../assets/avatar-profile.png";
import urlMentee from "../../Utilities/Mentee/urlMentee";

interface dataUser {
  name: string;
  gender: string;
  imageForm: string | null;
}

interface dataEdit {
  onSubmit: (data: any) => void;
  onclose: () => void;
  open?: boolean;
  data: dataUser;
}

export const ModalEditMentee = ({
  data,
  onSubmit,
  onclose,
  open,
}: dataEdit) => {
  const { isDark } = useTheme();
  const token = localStorage.getItem("accessToken");

  const [nameUser, setUserName] = useState("");
  const [genderUser, setGenderUser] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data && open) {
      setUserName(data.name || "");
      setGenderUser(data.gender || "");
      setImagePreview(data.imageForm || profile);
      setImageFile(null); // Reset file when modal opens
    }
  }, [data, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", nameUser);
      formData.append("gender", genderUser);

      if (imageFile) {
        formData.append("imageForm", imageFile);
      }

      const res = await axios.patch(urlMentee.EDIT_PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Make sure we're sending the correct data structure
      const updatedData = {
        name: nameUser,
        gender: genderUser,
        imageLink:
          res.data.imageLink ||
          (imageFile ? URL.createObjectURL(imageFile) : data.imageForm),
        ...res.data, // Include any additional data from the response
      };

      console.log("Response data:", res.data);
      console.log("Sending updated data:", updatedData);

      onSubmit(updatedData);

      // Clean up object URLs to prevent memory leaks
      if (imageFile && imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Clean up object URLs when closing
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    // Reset form
    setUserName("");
    setGenderUser("");
    setImagePreview(null);
    setImageFile(null);

    onclose();
  };

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* background */}
        <div className="fixed inset-0 bg-black/50" />

        {/* content */}
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <div
            className={`p-7 rounded w-[28rem] ${
              isDark ? "bg-[var(--primary-light)]" : "bg-white"
            }`}
          >
            <Dialog.Title
              className={`text-lg font-semibold mb-4 ${
                isDark
                  ? "text-[var(--secondary-light)]"
                  : "text-[var(--primary-light)]"
              }`}
            >
              Edit Profile
            </Dialog.Title>

            <div className="flex flex-col gap-4">
              {/* name */}
              <div className="flex flex-col gap-1">
                <label
                  className={`text-start text-base font-medium ${
                    isDark ? "text-gray-200" : "text-[var(--primary)]"
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={nameUser}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  disabled={isLoading}
                />
              </div>

              {/* gender */}
              <div className="flex flex-col gap-1">
                <label
                  className={`text-start text-base font-medium ${
                    isDark ? "text-gray-200" : "text-[var(--primary)]"
                  }`}
                >
                  Gender
                </label>
                <select
                  value={genderUser}
                  onChange={(e) => setGenderUser(e.target.value)}
                  className="border rounded-md p-2 bg-gray-100 focus:outline-none text-[var(--primary)]"
                  disabled={isLoading}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* image */}
              <div className="flex flex-col gap-2">
                <label
                  className={`text-start text-base font-medium ${
                    isDark ? "text-gray-200" : "text-[var(--primary)]"
                  }`}
                >
                  Profile Image
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 flex w-full items-center text-[var(--primary)] rounded-md h-12 p-2 border border-[var(--System-Gray-300)] bg-gray-100"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-7 flex justify-between">
              <button
                className={`px-2.5 py-2 border border-[#36414f] text-sm rounded-[8px] tracking-wider ${
                  isDark
                    ? "bg-[#36414f] text-white"
                    : "bg-white text-[var(--primary)]"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className={`px-2.5 py-2 font-semibold rounded-[8px] text-sm bg-[#fb2c36] text-white ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
