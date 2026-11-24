export function EditorialSections() {
  return (
    <div className="editorial-sections">
      <section id="studies" aria-labelledby="studies-title" tabIndex={-1}>
        <h2 id="studies-title">Studies</h2>
        <div>
          <p>Botanical Study / Blender Experiments</p>
          <a className="section-link" href="#botanical-study">View specimen <span aria-hidden="true">↗</span></a>
        </div>
      </section>
      <section id="about" aria-labelledby="about-title" tabIndex={-1}>
        <h2 id="about-title">About</h2>
        <p>Awaiting future content.</p>
      </section>
      <section id="contact" aria-labelledby="contact-title" tabIndex={-1}>
        <h2 id="contact-title">Contact</h2>
        <p>Awaiting future content.</p>
      </section>
    </div>
  )
}
