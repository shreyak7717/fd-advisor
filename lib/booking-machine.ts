import { createMachine, assign } from "xstate";
import { BookingContext, FDRate } from "@/types";
import { calculateMaturity, generateBookingId } from "./calculations";

type BookingEvent =
  | { type: "SELECT_FD"; fd: FDRate }
  | { type: "SET_AMOUNT"; amount: number }
  | { type: "CONFIRM_TENOR" }
  | { type: "SET_DETAILS"; fullName: string; phone: string; panNumber: string }
  | { type: "COMPLETE_KYC" }
  | { type: "CONFIRM_BOOKING" }
  | { type: "RESET" };

const initialContext: BookingContext = {
  selectedFD: null,
  amount: null,
  tenorMonths: null,
  fullName: "",
  phone: "",
  panNumber: "",
  maturityAmount: null,
  bookingId: null
};

export const bookingMachine = createMachine({
  id: "fd-booking",
  initial: "idle",
  context: initialContext,
  states: {
    idle: {
      on: {
        SELECT_FD: {
          target: "fd_selected",
          actions: assign({
            selectedFD: ({ event }) => event.fd,
            tenorMonths: ({ event }) => event.fd.tenor_months
          })
        }
      }
    },
    fd_selected: {
      on: {
        SET_AMOUNT: {
          target: "amount_input",
          actions: assign({
            amount: ({ event }) => event.amount,
            maturityAmount: ({ context, event }) =>
              context.selectedFD
                ? calculateMaturity(
                    event.amount,
                    context.selectedFD.interest_rate,
                    context.selectedFD.tenor_months
                  )
                : null
          })
        },
        RESET: { target: "idle", actions: assign(initialContext) }
      }
    },
    amount_input: {
      on: {
        CONFIRM_TENOR: { target: "tenor_confirmed" },
        SELECT_FD: {
          target: "fd_selected",
          actions: assign({ selectedFD: ({ event }) => event.fd })
        },
        RESET: { target: "idle", actions: assign(initialContext) }
      }
    },
    tenor_confirmed: {
      on: {
        SET_DETAILS: {
          target: "personal_details",
          actions: assign({
            fullName: ({ event }) => event.fullName,
            phone: ({ event }) => event.phone,
            panNumber: ({ event }) => event.panNumber
          })
        },
        RESET: { target: "idle", actions: assign(initialContext) }
      }
    },
    personal_details: {
      on: {
        COMPLETE_KYC: { target: "kyc_pending" },
        RESET: { target: "idle", actions: assign(initialContext) }
      }
    },
    kyc_pending: {
      on: {
        CONFIRM_BOOKING: {
          target: "confirmed",
          actions: assign({
            bookingId: () => generateBookingId()
          })
        },
        RESET: { target: "idle", actions: assign(initialContext) }
      }
    },
    confirmed: {
      on: {
        RESET: { target: "idle", actions: assign(initialContext) }
      }
    }
  }
});
