export function StepWizard({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="mb-8 flex items-center">
      {steps.map((step, i) => (
        <div key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                i < currentStep
                  ? 'bg-[var(--color-alert-green)] text-white'
                  : i === currentStep
                    ? 'bg-navy-600 text-white'
                    : 'bg-navy-50 text-navy-400'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`mt-1.5 max-w-[90px] text-center text-[11px] ${i === currentStep ? 'font-semibold text-navy-700' : 'text-navy-400'}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${i < currentStep ? 'bg-[var(--color-alert-green)]' : 'bg-navy-100'}`} />}
        </div>
      ))}
    </div>
  )
}
