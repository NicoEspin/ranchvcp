import Image from 'next/image'
import { galleryImages } from '@/lib/mock-data'

export function GallerySection() {
  return (
    <section className="py-16 md:py-24 bg-background-alt">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            El lugar, los platos, el ambiente
          </h3>
          <p className="text-foreground-muted">
            Algunas imágenes de lo que vas a encontrar cuando llegues.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className={`relative rounded-xl overflow-hidden ${
                index === 0 ? 'col-span-2 row-span-2 h-64 md:h-96' : 'h-32 md:h-48'
              }`}
            >
              <Image
                src={image.imageUrl}
                alt={image.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3">
                  <p className="text-sm text-foreground">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
