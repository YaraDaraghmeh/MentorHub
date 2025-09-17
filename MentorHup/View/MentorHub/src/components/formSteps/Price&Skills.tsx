import { useContext, useEffect, useState } from "react";
import FormFiled from "../Form/FormFiled";
import { StepperContext } from "../../Context/StepperContext";
import axios from "axios";
import urlSkills from "../../Utilities/Skills/urlSkills";

const PriceandSkills = () => {
  const { userData, setUserData } = useContext(StepperContext);
  const [skills, setSkills] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Toggle checkbox for a skill id
  const toggleSkill = (id: number) => {
    const current: number[] = Array.isArray((userData as any).skillIds)
      ? ((userData as any).skillIds as number[])
      : [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setUserData({ ...userData, skillIds: next });
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("accessToken")?.trim();
        const res = await axios.get(urlSkills.SKILLS, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
          params: { PageNumber: 1, PageSize: 100 },
        });

        const items = res.data?.items ?? res.data ?? [];
        const normalized = (items as any[]).map((it) => ({
          id: Number(it.id),
          name: (it.skillName ?? it.name ?? "").toString(),
        }));
        setSkills(normalized);
      } catch (err: any) {
        console.error("Failed to load skills", err.response?.data || err.message);
        setError("Failed to load skills");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="self-stretch inline-flex flex-col w-full justify-between items-start gap-3.5">
      {/* inputs */}
      <FormFiled
        onChange={handleChange}
        value={userData["price"] || ""}
        type="number"
        label="Price Booking"
        name="price"
        placeholder="0 $"
      />

      <label className="text-center justify-center text-[var(--primary)] text-base font-medium">
        Select Skills
      </label>
      {loading && <div className="text-sm text-gray-500">Loading skills...</div>}
      {error && (
        <div className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {skills.map((s) => {
            const checked = Array.isArray((userData as any).skillIds)
              ? ((userData as any).skillIds as number[]).includes(s.id)
              : false;
            return (
              <label key={s.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSkill(s.id)}
                />
                <span className="text-[var(--primary)]">{s.name}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PriceandSkills;
