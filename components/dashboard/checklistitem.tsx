interface ChecklistItemProps {
  label: string;
}

export default function ChecklistItem({ label }: ChecklistItemProps) {
  return (
    <label className="flex flex-row gap-x-3 py-3">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-2 border-[#d0e7d9] bg-transparent text-[#19e56b] checked:border-[#19e56b] checked:bg-[#19e56b] focus:outline-none focus:ring-0"
      />
      <p className="text-base font-normal text-[#0e1b13]">{label}</p>
    </label>
  );
}
