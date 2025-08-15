'use client';
import React from "react";
import TripForm from "@/components/dashboard/tripform";

export default function CreateTripPage() {
    return (
        <main className="flex-1 flex justify-center py-5 px-6">
            <div className="w-full max-w-[960px] flex flex-col gap-6">
                <TripForm />
            </div>
        </main>
    );
}
