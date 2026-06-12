export function QuienesSomos() {
  return (
    <div className="section-shell py-12">
      <div className="surface-panel p-6 sm:p-7">
        <div className="section-kicker">JD Store</div>
        <h1 className="mt-2 font-urbana text-4xl tracking-wide sm:text-5xl">¿Quiénes somos?</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-claro/65 sm:text-base">
          Somos una tienda enfocada en moda urbana masculina, con una propuesta clara de estilo, atención y experiencia tanto en el local como en la web.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,420px)]">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="surface-panel p-7 lg:p-8">
            <div className="text-sm font-semibold text-dorado">Nuestra esencia</div>
            <p className="mt-4 text-claro/75 leading-relaxed">
              En JD Store somos más que una tienda de ropa, somos un espacio donde el estilo urbano cobra vida. Nos
              encontramos en el Centro Comercial La 14 en Ibagué, Tolima, ofreciendo a nuestros clientes lo mejor de la moda
              urbana, combinando comodidad, tendencia y autenticidad.
            </p>
          </div>

          <div className="surface-panel p-7 lg:p-8">
            <div className="text-sm font-semibold text-dorado">Lo que buscamos</div>
            <p className="mt-4 text-claro/75 leading-relaxed">
              Nuestro objetivo es que cada persona que nos visite encuentre prendas que reflejen su esencia y su manera de
              vivir la calle, con un look fresco, moderno y lleno de personalidad.
            </p>
          </div>

          <div className="surface-panel p-7 lg:col-span-2 lg:p-8">
            <div className="text-sm font-semibold text-dorado">Nuestra propuesta</div>
            <p className="mt-4 text-claro/75 leading-relaxed">
              Seleccionamos prendas, combinaciones y referencias para que cada visita a la tienda se sienta clara, rápida y
              visualmente inspiradora, tanto en el local como dentro de la página.
            </p>
          </div>
        </div>

        <div className="surface-panel p-7 lg:p-8">
          <div className="text-sm text-dorado font-semibold">Ubicación</div>
          <div className="mt-2 text-claro/75">
            Centro Comercial La 14, Local 128, Piso 1, Ibagué, Tolima
          </div>

          <div className="mt-6 text-sm text-dorado font-semibold">Slogan</div>
          <div className="mt-2 text-claro/80 font-urbana text-2xl tracking-wide leading-tight">
            “En JD Store vestimos tu actitud, acompañamos tu flow y llevamos tu estilo a otro nivel.”
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 text-sm text-claro/70">
            <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/35 p-4">WhatsApp: +57 318 326 0720</div>
            <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/35 p-4">Instagram: @jd.store_12</div>
            <div className="rounded-2xl border border-grisOscuro bg-grisOscuro/35 p-4 sm:col-span-2 xl:col-span-1">
              TikTok: @jd.store.120
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

