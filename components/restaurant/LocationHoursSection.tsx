import { MapPin, Clock, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { restaurantSettings } from '@/lib/mock-data'

export function LocationHoursSection() {
  // Group hours by unique days
  const groupedHours = [
    { label: 'Lunes', value: 'Cerrado' },
    { label: 'Martes a Jueves', value: '12:00 - 15:30 · 20:00 - 00:00' },
    { label: 'Viernes y Sábado', value: '12:00 - 16:00 · 20:00 - 01:00' },
    { label: 'Domingo', value: '12:00 - 17:00 (solo mediodía)' },
  ]

  return (
    <section id="ubicacion" className="scroll-mt-24 bg-background py-16 md:scroll-mt-28 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
            Todo lo que suelen preguntar, antes de escribir.
          </h2>
          <p className="text-foreground-muted max-w-2xl mx-auto">
            Horarios, ubicación, fotos del lugar y respuestas rápidas para llegar con menos dudas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Location Card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground">Ubicación</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-foreground mb-1">{restaurantSettings.address}</p>
              <p className="text-foreground-muted">{restaurantSettings.neighborhood}</p>
            </div>

            {/* Map Placeholder */}
            <div className="relative h-48 rounded-xl overflow-hidden mb-6 bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm text-foreground-muted">Vista del mapa</p>
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a href={restaurantSettings.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-4 h-4 mr-2" />
                Cómo llegar
              </a>
            </Button>
          </div>

          {/* Hours Card */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-olive/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-olive" />
              </div>
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl text-foreground">Horarios</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${restaurantSettings.isOpen ? 'bg-olive/20 text-olive' : 'bg-accent/20 text-accent'}`}>
                  {restaurantSettings.isOpen ? 'Abierto ahora' : 'Cerrado ahora'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {groupedHours.map((hour) => (
                <div key={hour.label} className="flex justify-between items-center">
                  <span className="text-foreground-muted">{hour.label}</span>
                  <span className={`text-foreground ${hour.value === 'Cerrado' ? 'text-foreground-muted' : ''}`}>
                    {hour.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-foreground-muted">
                <strong className="text-foreground">Nota:</strong> La cocina cierra 30 minutos antes del horario de cierre.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
