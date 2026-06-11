/**
 * Preloader de marca — server component, CSS-driven.
 *
 * - El script inline corre ANTES del primer paint: si ya se vio en esta sesión,
 *   agrega .pl-skip al <html> y el overlay nunca aparece (cero flash).
 * - La animación completa (reveal + salida) vive en CSS, así no depende de la
 *   hidratación. Con prefers-reduced-motion el overlay directamente no existe.
 */
export function Preloader() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{if(sessionStorage.getItem('ranch-pl')){document.documentElement.classList.add('pl-skip')}else{sessionStorage.setItem('ranch-pl','1')}}catch(e){}`,
        }}
      />
      <div className="pl-overlay" aria-hidden="true">
        <div className="pl-inner">
          <p className="pl-eyebrow">Villa Carlos Paz · Córdoba</p>
          <p className="pl-word">
            <span className="pl-word-inner">RANCH VCP</span>
          </p>
          <div className="pl-line" />
        </div>
      </div>
    </>
  )
}
