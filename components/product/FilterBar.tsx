const filters = ["Category", "Eco Rating"];

export default function FilterBar() {
  return (
    <div className="flex gap-3 p-3 flex-wrap pr-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#e7f3ec] pl-4 pr-2"
        >
          <p className="text-[#0e1b13] text-sm font-medium leading-normal">{filter}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
          </svg>
        </button>
      ))}
    </div>
  );
}
