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
  const [query, setQuery] = useState("");

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
        Select Skills (you can choose multiple)
      </label>
      <input
        type="text"
        placeholder="Search skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-[var(--secondary-dark)] text-[0000000] placeholder-gray-400 outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
      {loading && <div className="text-sm text-gray-500">Loading skills...</div>}
      {error && (
        <div className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && (
        <>
          {/* Selected chips */}
          <div className="w-full flex flex-wrap gap-2 py-2">
            {(Array.isArray((userData as any).skillIds)
              ? ((userData as any).skillIds as number[])
              : []
            )
              .map((id) => skills.find((s) => s.id === id))
              .filter(Boolean)
              .map((s) => (
                <span
                  key={(s as any).id}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-[var(--primary)] text-white text-sm"
                >
                  {(s as any).name}
                  <button
                    type="button"
                    onClick={() => toggleSkill((s as any).id)}
                    className="ml-1 rounded-full bg-white/20 hover:bg-white/30 w-5 h-5 flex items-center justify-center"
                    aria-label="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>

          {/* Scrollable list */}
          <div
            role="listbox"
            aria-multiselectable
            className="w-full max-h-64 overflow-auto rounded-md border border-gray-700/40 divide-y divide-gray-700/20"
          >
            {skills
              .filter((s) =>
                query.trim().length === 0
                  ? true
                  : s.name.toLowerCase().includes(query.toLowerCase())
              )
              .map((s) => {
                const checked = Array.isArray((userData as any).skillIds)
                  ? ((userData as any).skillIds as number[]).includes(s.id)
                  : false;
                return (
                  <label
                    key={s.id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[var(--teal-900)]/40"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSkill(s.id)}
                      className="accent-[var(--primary)]"
                    />
                    <span className="text-[000000]">{s.name}</span>
                  </label>
                );
              })}
          </div>

          {/* Actions */}
          <div className="w-full flex gap-3 pt-2">
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-[var(--primary)]/90 hover:bg-[var(--primary)] text-white text-sm"
              onClick={() =>
                setUserData({
                  ...userData,
                  skillIds: skills.map((s) => s.id),
                })
              }
            >
              Select All
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md bg-gray-600/50 hover:bg-gray-600 text-white text-sm"
              onClick={() => setUserData({ ...userData, skillIds: [] })}
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PriceandSkills;
