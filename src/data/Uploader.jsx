import { isFuture, isPast, isToday } from "date-fns";
import { useState } from "react";
import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates } from "../utils/helpers";
import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

const originalSettings = {
  minBookingLength: 3,
  maxBookingLength: 30,
  maxGuestsPerBooking: 10,
  breakfastPrice: 15,
};

async function deleteGuests() {
  const { error } = await supabase.from("gest").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from("cabin").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await supabase.from("bookings").delete().gt("id", 0);
  if (error) console.log(error.message);
}

async function createGuests() {
  const { error } = await supabase.from("gest").insert(guests);
  if (error) console.log(error.message);
}

async function createCabins() {
  const { error } = await supabase.from("cabin").insert(cabins);
  if (error) console.log(error.message);
}

async function createBookings() {
  const { data: guestsIds } = await supabase
    .from("gest")
    .select("id")
    .order("id");

  const allGuestIds = guestsIds.map((cabin) => cabin.id);

  const { data: cabinsIds } = await supabase
    .from("cabin")
    .select("id")
    .order("id");

  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  const finalBookings = bookings.map((booking) => {
    const cabin = cabins.at(booking.cabinId - 1);
    const numberNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numberNights * (cabin.regularPrice - cabin.discount);
    const extrasPrices = booking.hasBreakfast
      ? numberNights * 15 * booking.numGuestes
      : 0;
    const numGuestes = booking.numGuestes;
    const created_at = booking.created_at;
    const totalPrice = cabinPrice + extrasPrices;
    const endDate = booking.endDate;
    const startDate = booking.startDate;
    const isPaid = booking.isPaid;
    const hasBreakfast = booking.hasBreakfast;
    const observations = booking.observations;

    let status;
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    )
      status = "checked-out";
    if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = "checked-in";

    return {
      hasBreakfast,
      observations,
      endDate,
      startDate,
      numberNights,
      cabinPrice,
      extrasPrices,
      created_at,
      totalPrice,
      numGuestes,
      guestId: allGuestIds.at(booking.guestId - 1),
      cabinId: allCabinIds.at(booking.cabinId - 1),
      status,
      isPaid,
    };
  });

  console.log(finalBookings);

  const { error } = await supabase.from("bookings").insert(finalBookings);
  if (error) console.log(error.message);
}

export function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    // Bookings need to be deleted FIRST
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    // Bookings need to be created LAST
    await createGuests();
    await createCabins();
    await createBookings();

    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
      }}
    >
      <h3>DEV AREA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL sample data
      </Button>
      <hr />
      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload CURRENT bookings
      </Button>
      <p>You can run this every day you develop the app</p>
    </div>
  );
}
