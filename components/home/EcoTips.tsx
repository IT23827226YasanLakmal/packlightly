interface Tip {
  title: string;
  description: string;
  image: string;
}

const tips: Tip[] = [
  {
    title: "Choose Reusable Travel Bottles",
    description: "Reduce plastic waste with reusable water bottles and containers.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBxMJj1zKxXmaMkSHjHXAHJtoUIhEHiAojUb7uuLmnesC_d8pVsJkndXEz-zBir6iLvmUM6WqmdG6Aph6xg6zLFx0XcKecKZTV1qzx0CYGAJ_cWRvgkAaNhcGJxIQYLJfTVjkyXSy_Ax0Ev59fcIwsWf3BV7BSOIRsYAQLwpLzVbtrYqlSmx2KSYD9XNocE0H6QoiMdJlrRHqX1qQlnoO5VoKLs9u7fKDG4sdup-MVMgU7o6YHH0h-kJbToqJQkbkGI1xTx320JQBZ",
  },
  {
    title: "Pack Light, Fly Right",
    description: "Lighter luggage means less fuel consumption. Pack only essentials.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCtexLrND9q7ui3_OyVMke28mWg0kIK8d3NTd6D_irSpSU0TA_MOup62EMzz14iED2Avgvfw1MMiEZkT4OIRnTfWq2HaH59pDRy_gJa671nEyJ2ufyxSqhi70iTXwWdagKqL_J31gWmPbE_InbTgMsZfyne80s1XfOhNzqyeuDHrMGct3S3kya9PhrPp-Qwv9-8BXw8WEueoiFePHCWyibIRwFP-Uo3-L4sQ2STt_DqbPpakowRrctBrxEELKIKSz1IWFjanEi1caP",
  },
  {
    title: "Support Local Businesses",
    description: "Opt for local experiences and products to support communities.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAasZf8UxK0i5IKS3dO6NObHg89fobu6kMPO5eXhdnRxsv2Ivg543ZNd-K_cgN8KIp2foJwZt8MsgWlCFRolaJJjvSY2rHvQy_NZMdjwe1bEVBtXGPsbg_-Zi4f3ksWR6_wKou2FcMxUY-dm9jpdh4OvYmgxP5Dmt-75Q2oX2DwvopxzlRaWhydfGH-aEpyQugDlB6xBOSKHW1j5RoulwKxLZew0TmYbRBkfyZtPiuymVyP94uSUgjGt0XijWP2VwJypUwmLBxeIWNq",
  },
];

export default function EcoTips() {
  return (
    <section>
      <h2 className="text-[22px] font-bold px-4 pt-5 pb-3">Featured Eco Tips</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {tips.map((tip, i) => (
          <div key={i} className="flex flex-col gap-3 pb-3">
            <div
              className="w-full aspect-square bg-cover rounded-xl"
              style={{ backgroundImage: `url(${tip.image})` }}
            />
            <div>
              <p className="text-base font-medium">{tip.title}</p>
              <p className="text-[#4e976b] text-sm">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
