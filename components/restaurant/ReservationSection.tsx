'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, MapPin, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MaskReveal, Reveal } from '@/components/motion'
import { homeCopy } from '@/lib/home-copy'
import { locations } from '@/lib/mock-data'
import {
  generateReservationMessage,
  getLocationEmbedUrl,
  getLocationMapsUrl,
  primaryLocation,
} from '@/lib/whatsapp'

const LUNCH_SLOTS = ['12:30', '13:00', '13:30', '14:00', '14:30', '15:00']
const NIGHT_SLOTS = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
const PEOPLE_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Más de 10']

const reservationSchema = z.object({
  name: z.string().trim().min(1, 'Ingresá tu nombre.'),
  people: z.string().min(1, 'Indicá cuántos son.'),
  date: z.string().min(1, 'Elegí el día.'),
  time: z.string().min(1, 'Elegí la hora.'),
  comment: z.string().trim().optional(),
})

type ReservationValues = z.infer<typeof reservationSchema>

export function ReservationSection() {
  const [locationId, setLocationId] = useState(primaryLocation.id)
  const [mapActive, setMapActive] = useState(false)
  const selectedLocation =
    locations.find((location) => location.id === locationId) ?? primaryLocation

  const form = useForm<ReservationValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { name: '', people: '2', date: '', time: '', comment: '' },
  })

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = (values: ReservationValues) => {
    const url = generateReservationMessage({
      name: values.name,
      date: values.date,
      time: values.time,
      people: Number.parseInt(values.people, 10) || 11,
      comment: values.comment,
      location: selectedLocation,
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="salon" className="section-shell py-12 md:py-16">
      <div className="border-t border-border/70 pt-12">
        {/* ── Header ── */}
        <div id="reservas" className="mb-10 max-w-2xl space-y-6">
          <Reveal y={14}>
            <p className="eyebrow">{homeCopy.reservation.eyebrow}</p>
          </Reveal>
          <h2 className="font-serif text-[clamp(2.6rem,6vw,4.5rem)] uppercase leading-[0.92] tracking-[0.04em] text-foreground">
            <MaskReveal>{homeCopy.reservation.title[0]}</MaskReveal>
            <MaskReveal delay={0.12} className="mt-3 text-primary">
              {homeCopy.reservation.title[1]}
            </MaskReveal>
          </h2>
          <Reveal delay={0.18}>
            <p className="max-w-xl text-base leading-7 text-foreground-muted">
              {homeCopy.reservation.description}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          {/* ── Formulario ── */}
          <Reveal y={30}>
            <div className="editorial-card rounded-[2rem] p-5 md:p-7">
              {/* Selector de sucursal */}
              <p className="text-xs uppercase tracking-[0.24em] text-primary">Elegí la sucursal</p>
              <div role="radiogroup" aria-label="Sucursal" className="mt-3 grid gap-3 sm:grid-cols-2">
                {locations.map((location) => {
                  const isSelected = location.id === locationId
                  return (
                    <button
                      key={location.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setLocationId(location.id)}
                      className={`rounded-[1.25rem] border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        isSelected
                          ? 'border-primary/70 bg-primary/10'
                          : 'border-border bg-background/40 hover:border-primary/40'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-serif text-lg uppercase tracking-[0.04em] text-foreground">
                          {location.name}
                        </span>
                        <span
                          aria-hidden
                          className={`size-2.5 shrink-0 rounded-full transition-colors ${
                            isSelected ? 'bg-primary' : 'border border-border'
                          }`}
                        />
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                        {location.address}
                      </span>
                    </button>
                  )
                })}
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input {...field} autoComplete="name" placeholder="Tu nombre" className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="people"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Personas</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="¿Cuántos son?" />
                              </SelectTrigger>
                              <SelectContent>
                                {PEOPLE_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option === '1' ? '1 persona' : option === 'Más de 10' ? option : `${option} personas`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" min={today} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-11 w-full">
                                <SelectValue placeholder="Elegí la hora" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Mediodía</SelectLabel>
                                  {LUNCH_SLOTS.map((slot) => (
                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                  ))}
                                </SelectGroup>
                                <SelectGroup>
                                  <SelectLabel>Noche</SelectLabel>
                                  {NIGHT_SLOTS.map((slot) => (
                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentario (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder="Cumpleaños, mesa afuera, silla para bebé…"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button type="submit" className="cta-primary cta-block">
                    <Send className="size-4" />
                    <span>Reservar en {selectedLocation.name}</span>
                  </button>
                  <p className="text-center font-mono text-[0.58rem] uppercase tracking-[0.2em] text-foreground-muted/50">
                  El local confirma por WhatsApp
                  </p>
                </form>
              </Form>
            </div>
          </Reveal>

          {/* ── Mapa de la sucursal ── */}
          <Reveal y={30} delay={0.12}>
            <div className="editorial-card relative h-full min-h-[24rem] overflow-hidden rounded-[2rem] lg:min-h-full">
              <iframe
                key={selectedLocation.id}
                src={getLocationEmbedUrl(selectedLocation)}
                title={`Mapa de Ranch — ${selectedLocation.name}`}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="ranch-map absolute inset-0 h-full w-full border-0"
                style={{ pointerEvents: mapActive ? 'auto' : 'none' }}
              />

              {/* Guarda de scroll: el iframe captura la rueda; se activa con un toque */}
              {!mapActive ? (
                <button
                  type="button"
                  onClick={() => setMapActive(true)}
                  className="group absolute inset-0 flex items-end justify-center bg-transparent pb-24 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-primary"
                  aria-label="Activar la exploración del mapa"
                >
                  <span className="editorial-chip text-[0.62rem] uppercase tracking-[0.2em] text-primary opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    Tocá para explorar el mapa
                  </span>
                </button>
              ) : null}

              {/* Info de la sucursal seleccionada */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5">
                <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-primary/15 bg-black/70 p-4 backdrop-blur-md">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <p className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-primary">
                        {selectedLocation.name}
                      </p>
                      <p className="mt-1 text-sm leading-5 text-foreground-muted">
                        {selectedLocation.address}
                      </p>
                    </div>
                  </div>
                  <a
                    href={getLocationMapsUrl(selectedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-ghost cta-sm"
                  >
                    <span>Cómo llegar</span>
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
