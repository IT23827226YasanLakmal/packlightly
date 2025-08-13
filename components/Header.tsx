import Logo from "@/public/images/PackLightlyLogo.svg";
import Image from "next/image";

export default function Header() {

  const routes = [
    { name: "Community", path: "/community" },
    { name: "Eco Products", path: "/eco-products" },
    { name: "News", path: "/news" },
    { name: "About Us", path: "/about" },
  ];
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7f3ec] px-10 py-3">
      <div className="flex items-center gap-4 text-[#0e1b13]">
          <Image src={Logo} alt="PackLight Logo" width={25} height={25} />
        <h2 className="text-lg font-bold tracking-[-0.015em]">PackLightly</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          {routes.map((item) => (
            <a key={item.name} className="text-sm font-medium" href={item.path}>
              {item.name}
            </a>
          ))}
        </div>
        <button className="px-4 py-2 rounded-lg bg-[#19e56b] text-sm font-bold">
          Login / Sign Up
        </button>
      </div>
    </header>
  );
}
