'use client'

import { useState } from 'react'
import { User, Calendar, Clock, Users, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateReservationMessage } from '@/lib/whatsapp'

export function ReservationSection() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    people: '2',
    comment: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const url = generateReservationMessage({
      name: formData.name,
      date: formData.date,
      time: formData.time,
      people: parseInt(formData.people),
      comment: formData.comment,
    })
    window.open(url, '_blank')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <section id="reservas" className="scroll-mt-24 bg-background-alt py-16 md:scroll-mt-28 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 text-balance">
              Reservar no tiene que empezar con veinte mensajes.
            </h2>
            <p className="text-foreground-muted max-w-2xl mx-auto mb-2">
              Completá los datos básicos y enviá una solicitud clara por WhatsApp.
            </p>
            <p className="text-sm text-foreground-muted max-w-xl mx-auto">
              El restaurante recibe tu nombre, día, horario, cantidad de personas y cualquier detalle importante en un solo mensaje.
            </p>
          </div>

          {/* Form Card */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {/* Notice */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8">
              <p className="text-sm text-foreground-muted">
                <strong className="text-foreground">Importante:</strong> Esto no confirma automáticamente la mesa. Ordena la solicitud para que el equipo pueda responder mejor.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-foreground-muted flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12 bg-input border-border text-foreground placeholder:text-foreground-muted/50 focus:border-primary"
                  />
                </div>

                {/* People */}
                <div className="space-y-2">
                  <label htmlFor="people" className="text-sm text-foreground-muted flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Personas
                  </label>
                  <select
                    id="people"
                    value={formData.people}
                    onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                    required
                    className="w-full h-12 bg-input border border-border rounded-lg px-4 text-foreground focus:border-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                    <option value="more">Más de 10</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm text-foreground-muted flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </label>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="h-12 bg-input border-border text-foreground focus:border-primary"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm text-foreground-muted flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora
                  </label>
                  <select
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                    className="w-full h-12 bg-input border border-border rounded-lg px-4 text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">Seleccionar hora</option>
                    <optgroup label="Mediodía">
                      <option value="12:00">12:00</option>
                      <option value="12:30">12:30</option>
                      <option value="13:00">13:00</option>
                      <option value="13:30">13:30</option>
                      <option value="14:00">14:00</option>
                      <option value="14:30">14:30</option>
                      <option value="15:00">15:00</option>
                    </optgroup>
                    <optgroup label="Noche">
                      <option value="20:00">20:00</option>
                      <option value="20:30">20:30</option>
                      <option value="21:00">21:00</option>
                      <option value="21:30">21:30</option>
                      <option value="22:00">22:00</option>
                      <option value="22:30">22:30</option>
                      <option value="23:00">23:00</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm text-foreground-muted flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comentario (opcional)
                </label>
                <textarea
                  id="comment"
                  placeholder="Cumpleaños, mesa afuera, silla para bebé..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-foreground-muted/50 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-14 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 text-base"
              >
                <Send className="w-5 h-5 mr-2" />
                Solicitar reserva por WhatsApp
              </Button>
            </form>

            {/* Bullets */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-sm text-foreground-muted mb-4">Tu solicitud incluye:</p>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-foreground-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Nombre y cantidad de personas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Día y horario
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Comentario especial
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Mensaje prearmado
                </li>
              </ul>
            </div>
          </div>

          {/* Memorable Quote */}
          <div className="text-center mt-12">
            <p className="text-foreground-muted italic">
              &ldquo;Una buena reserva empieza con una conversación clara.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
