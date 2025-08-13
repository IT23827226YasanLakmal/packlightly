import React from "react";

interface TripCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

export const TripCard: React.FC<TripCardProps> = ({ imageUrl, title, description }) => {
  return (
    <div className="flex flex-col gap-3 pb-3">
      <div
        className="w-full aspect-video bg-cover bg-center rounded-xl"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div>
        <p className="text-[#0e1b13] text-base font-medium">{title}</p>
        <p className="text-[#4e976b] text-sm">{description}</p>
      </div>
    </div>
  );
};
