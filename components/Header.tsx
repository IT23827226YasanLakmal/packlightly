export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f3ec] px-10 py-3">
      <div className="flex items-center gap-4 text-[#0e1b13]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-[-0.015em]">PackLight</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          {["Trips", "Community", "Eco Products", "News"].map((item) => (
            <a key={item} className="text-sm font-medium" href="#">
              {item}
            </a>
          ))}
        </div>
        <button className="flex min-w-[84px] h-10 px-4 items-center justify-center rounded-xl bg-[#19e56b] text-sm font-bold tracking-[0.015em]">
          Start Packing
        </button>
      </div>
    </header>
  );
}
