import React from "react";
import Header from "../components/Header";
import TrendingCard from "../components/TrendingCard";
import PostListItem from "../components/PostListItem";

export default function Home() {
  return (
    <>
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-[#0e1b13] tracking-light text-[32px] font-bold leading-tight">Community Forum</p>
              <p className="text-[#4e976b] text-sm font-normal leading-normal">
                Ask questions, share tips, and connect with fellow eco-conscious travelers.
              </p>
            </div>
          </div>

          <div className="flex px-4 py-3 justify-end">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#19e56b] text-[#0e1b13] text-sm font-bold leading-normal tracking-[0.015em]">
              <span className="truncate">Create Post</span>
            </button>
          </div>

          <h3 className="text-[#0e1b13] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Trending Posts</h3>

          <div className="p-4">
            <TrendingCard
              title="Sustainable Travel Tips for Southeast Asia"
              description="Share your best practices for minimizing your environmental impact while exploring the region."
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAHvG6TaoQEHOIa6xVJxyfbfYfEqCD-lttTDcAuwDKnRMVItjmwuMVEiMZYgb66s4TScuT6I6Uq18HsnEK8ng-piYmqCR-pG8aXUvFCSmfahjLh_WHVr0UFgE8S2O7bNtopjcqTpyo3sMkzpn93i9LO0QipZ8PfS-mIJMwFoz7WZTBCxyKWccP4RApTjH1lXxV4WjTPNqFIIU5sKxSs5IB33QDCIUKfk5T49Zf2u4IgkiFhcAtaca_eJn_URv7VxvGBO9rHbjqe4tbh"
            />
          </div>

          <div className="p-4">
            <TrendingCard
              title="Packing Light for a Month-Long Trip"
              description="What are your go-to items and strategies for traveling light without sacrificing essentials?"
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuAw-gId5YdAogc8QeUSwD3Jqhwp0RhZqszbkIUUZ1Ci1xp15DE-ozNGvsczUz5b4xVwaTqLdYVYkNtNTyqCS5CBeBDpyJ1ofQrdQB5pfAAUu82Lz3kp6Ry7vMEvNusKiyZcB8_OWGoa7gZQQZ_h2IBVbpKueCX7TpplXEWXjxLdn5rcjcz2VDC396znv3Tdfa_QU5hG8rwC8iIrwpp11ohcKZdqxn1c3yu1RINehiZywMRFXwLCcLD6F8VI7F-2PHF4S8y7omKqs2Wp"
            />
          </div>

          <h3 className="text-[#0e1b13] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Recent Posts</h3>

          <div className="flex gap-4 bg-[#f8fcfa] px-4 py-3 justify-between">
            <PostListItem title="Best Eco-Friendly Gear for Hiking?" time="3 days ago" author="@ecoTraveler22" />
          </div>

          <div className="flex gap-4 bg-[#f8fcfa] px-4 py-3 justify-between">
            <PostListItem title="Tips for Reducing Plastic Waste on the Road?" time="1 week ago" author="@WanderlustJess" />
          </div>

          <div className="flex gap-4 bg-[#f8fcfa] px-4 py-3 justify-between">
            <PostListItem title="Favorite Sustainable Travel Destinations?" time="2 weeks ago" author="@GreenAdventurer" />
          </div>

          <div className="flex gap-4 bg-[#f8fcfa] px-4 py-3 justify-between">
            <PostListItem title="How to Offset Your Carbon Footprint While Traveling?" time="3 weeks ago" author="@EarthLover88" />
          </div>
        </div>
      </div>
    </>
  );
}
