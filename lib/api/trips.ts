import axiosClient from "../axiosClient";
import { Trip } from "@/types/index";

export async function fetchTrips(): Promise<Trip[]> {
  const { data } = await axiosClient.get("/trips");
  return data;
}

export async function createTrip(trip: Partial<Trip>): Promise<Trip> {
  const { data } = await axiosClient.post("/trips", trip);
  return data;
}
