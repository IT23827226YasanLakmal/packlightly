interface ButtonProps {
  label: string;
}

export default function Button({ label }: ButtonProps) {
  return (
    <button className="flex h-10 min-w-[84px] max-w-[480px] items-center justify-center rounded-xl bg-[#19e56b] px-4 text-sm font-bold text-[#0e1b13]">
      <span className="truncate">{label}</span>
    </button>
  );
}
