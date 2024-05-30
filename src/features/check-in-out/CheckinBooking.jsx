import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import BookingDataBox from "../../features/bookings/BookingDataBox";

import { useBooking } from "../../features/bookings/useBooking";
import { useMoveBack } from "../../hooks/useMoveBack";

import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { useChecking } from "./useCheckin";
import { useSettings } from "../settings/useSettings";
// import { box } from "styles/styles";

const Box = styled.div`
  /* {box} */
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const moveBack = useMoveBack();
  const { checkIn, isCheckIn } = useChecking();
  const { data: booking, isLoading } = useBooking();
  const { settings, isLoading: isLoadingSettings } = useSettings();

  useEffect(
    function () {
      setAddBreakfast(booking?.hasBreakfast ?? false);
      setConfirmPaid(booking?.isPaid ?? false);
    },
    [booking]
  );

  if (isLoading || isLoadingSettings) return <Spinner />;

  const {
    id: bookingId,
    gest,
    totalPrice,
    numGuestes,
    hasBreakfast,
    numberNights,
  } = booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numberNights * numGuestes;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkIn({
        bookingId,
        breakfast: {
          hasBreakfast: true,
          extrasPrices: optionalBreakfastPrice,
          totalPrice: totalPrice + optionalBreakfastPrice,
        },
      });
    } else {
      checkIn({ bookingId, breakfast: {} });
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading type="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            id={addBreakfast}
            onChange={() => {
              setAddBreakfast((addBreakfast) => !addBreakfast);
              setConfirmPaid(false);
            }}
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          id={confirmPaid}
          disabled={confirmPaid || isCheckIn}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
        >
          I confirm that {gest.fullName} has paid the total amount of{" "}
          {addBreakfast
            ? `${formatCurrency(totalPrice + optionalBreakfastPrice)}
            (${formatCurrency(totalPrice)} 
            + 
            ${formatCurrency(optionalBreakfastPrice)})
            `
            : formatCurrency(totalPrice)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button disabled={!confirmPaid || isCheckIn} onClick={handleCheckin}>
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
