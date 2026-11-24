export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-brand" href="#top" aria-label="The Creative Space home">
        THE CREATIVE
        <br />
        SPACE.
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#featured-work">Work</a>
        <a href="#studies">Studies</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  )
}
