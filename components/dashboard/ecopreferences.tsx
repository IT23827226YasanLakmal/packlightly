'use client';

export default function EcoPreferences() {
  const preferences = [
    "Prefer reusable items",
    "Avoid single-use plastics",
    "Show only vegan/cruelty-free products",
    "Show climate impact estimates",
  ];

  return (
    <div className="flex flex-col gap-2 bg-[#f8fcf8] p-4 rounded-xl">
      <h3 className="text-lg font-bold text-[#0d1b0d]">Eco Preferences</h3>
      {preferences.map((pref, idx) => (
        <label key={idx} className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-[#cfe7cf] border-2 bg-transparent text-[#13eb13] checked:bg-[#13eb13] focus:outline-none"
          />
          <span className="text-[#0d1b0d]">{pref}</span>
        </label>
      ))}
    </div>
  );
}
