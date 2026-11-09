function Banner() {
  return (
    <section className="relative min-h-56 overflow-hidden rounded-xl bg-linear-to-r from-[#5d6872] via-[#9da4a9] to-[#d8dadd]">
      <div className="absolute inset-0 from-black/40 to-transparent" />
      <div className="absolute bottom-8 left-8 text-white">
        <h1 className="text-3xl font-bold">Boa tarde, Matheus!</h1>
        <p className="mt-1 text-sm font-medium">Terça-feira, 25 de agosto</p>
      </div>
    </section>
  );
}

export default Banner;
