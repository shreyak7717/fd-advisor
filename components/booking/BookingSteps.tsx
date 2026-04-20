import clsx from "clsx";

const STEPS = [
  { key: "fd_selected",      label: "FD चुनें" },
  { key: "amount_input",     label: "राशि" },
  { key: "tenor_confirmed",  label: "अवधि" },
  { key: "personal_details", label: "जानकारी" },
  { key: "kyc_pending",      label: "KYC" },
  { key: "confirmed",        label: "पक्का" }
];

type StepKey = typeof STEPS[number]["key"] | "idle";

interface Props {
  currentStep: StepKey;
}

function stepIndex(key: StepKey): number {
  return STEPS.findIndex(s => s.key === key);
}

export function BookingSteps({ currentStep }: Props) {
  const current = stepIndex(currentStep);

  return (
    <div className="flex items-center gap-1 px-4 py-3 overflow-x-auto">
      {STEPS.map((step, i) => {
        const done   = current > i;
        const active = current === i;

        return (
          <div key={step.key} className="flex items-center gap-1 flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className={clsx(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                  done   ? "step-done"   : "",
                  active ? "step-active" : "",
                  !done && !active ? "step-idle" : ""
                )}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className={clsx(
                  "text-[9px] devanagari whitespace-nowrap",
                  active ? "text-saffron-600 font-medium" : "text-ink-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={clsx(
                  "w-6 h-px mb-3 transition-all",
                  done ? "bg-ink-800" : "bg-ink-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
