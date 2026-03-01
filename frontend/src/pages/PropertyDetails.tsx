import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { sampleProperties, formatPrice } from "@/data/properties";
import { Button } from "@/components/ui/button";
import { Bed, Bath, Maximize, MapPin, Building2, ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const PropertyDetails = () => {
  const { id } = useParams();
  const property = sampleProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <Layout>
        <div className="pt-32 pb-20 text-center container mx-auto px-4">
          <h1 className="font-display text-3xl text-foreground mb-4">Property Not Found</h1>
          <Button variant="gold" asChild>
            <Link to="/properties">Back to Properties</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const categoryLabel = { "off-plan": "Off-Plan", secondary: "Resale", rental: "Rental" };

  return (
    <Layout>
      <div className="pt-20">
        {/* Image */}
        <div className="h-[50vh] md:h-[60vh] relative overflow-hidden">
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute top-6 left-6">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/properties">
                <ArrowLeft className="w-4 h-4" /> Back
              </Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 -mt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-xl shadow-luxury p-8 md:p-12"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground font-body">
                {categoryLabel[property.category]}
              </Badge>
              {property.status === "ready" && (
                <Badge className="bg-gold text-accent-foreground font-body">Ready</Badge>
              )}
              <Badge variant="outline" className="font-body capitalize">{property.type}</Badge>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {property.title}
            </h1>
            <p className="flex items-center gap-2 text-muted-foreground font-body mb-6">
              <MapPin className="w-4 h-4 text-gold" /> {property.location}
            </p>

            <p className="font-display text-3xl md:text-4xl font-bold text-gold mb-8">
              {formatPrice(property.price, property.category)}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 py-8 border-y border-border">
              <div className="text-center">
                <Bed className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="font-display text-xl font-bold text-foreground">{property.bedrooms}</p>
                <p className="text-muted-foreground font-body text-sm">Bedrooms</p>
              </div>
              <div className="text-center">
                <Bath className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="font-display text-xl font-bold text-foreground">{property.bathrooms}</p>
                <p className="text-muted-foreground font-body text-sm">Bathrooms</p>
              </div>
              <div className="text-center">
                <Maximize className="w-6 h-6 text-gold mx-auto mb-2" />
                <p className="font-display text-xl font-bold text-foreground">{property.area.toLocaleString()}</p>
                <p className="text-muted-foreground font-body text-sm">Sq. Ft.</p>
              </div>
              {property.developer && (
                <div className="text-center">
                  <Building2 className="w-6 h-6 text-gold mx-auto mb-2" />
                  <p className="font-display text-lg font-bold text-foreground">{property.developer}</p>
                  <p className="text-muted-foreground font-body text-sm">Developer</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">About This Property</h2>
              <p className="text-muted-foreground font-body leading-relaxed">
                Experience luxury living at its finest in this stunning {property.type} located in {property.location}.
                Featuring {property.bedrooms} spacious bedrooms and {property.bathrooms} elegantly designed bathrooms,
                this {property.area.toLocaleString()} sq.ft. property offers panoramic views and world-class amenities.
                {property.developer && ` Developed by ${property.developer}, one of the UAE's most prestigious developers.`}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link to="/contact">
                  <Phone className="w-5 h-5" /> Enquire Now
                </Link>
              </Button>
              <Button variant="whatsapp" size="xl" asChild>
                <a href="https://wa.me/971000000000" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/contact">Schedule Viewing</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="h-20" />
      </div>
    </Layout>
  );
};

export default PropertyDetails;
