export function HeroCopy() {
  return (
    <section className="hero-copy" aria-labelledby="hero-title">
      <p className="eyebrow">A personal creative studio</p>
      <h1 className="hero-title" id="hero-title">
        <span>THE CREATIVE</span>
        <span>
          SPACE<span className="hero-accent">.</span>
        </span>
      </h1>
      <p className="hero-intro">
        Ideas take shape through design, code, and experimentation.
      </p>
      <a className="explore-link" href="#featured-work">
        Explore the work <span aria-hidden="true">↗</span>
      </a>
    </section>
  )
}
