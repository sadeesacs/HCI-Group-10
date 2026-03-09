import shopHeroImage from "@/assets/shop-hero-collection.jpg";

const ShopHeroBanner = () => {
  return (
    <section className="relative h-[420px] lg:h-[480px] overflow-hidden">
      <img
        src={shopHeroImage}
        alt="Casa Ceylon furniture collection"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container flex h-full items-center justify-center">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80 mb-3">
            The Collection
          </p>
          <h1 className="font-display text-4xl font-normal text-white md:text-5xl lg:text-6xl leading-tight">
            Furniture for Every Room
          </h1>
        </div>
      </div>
    </section>
  );
};

export default ShopHeroBanner;