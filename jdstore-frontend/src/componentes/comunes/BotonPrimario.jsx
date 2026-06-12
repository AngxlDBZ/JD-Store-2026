export function BotonPrimario({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-dorado px-4 py-2 text-oscuro font-semibold hover:bg-doradoClaro transition ${className}`}
    >
      {children}
    </button>
  )
}

