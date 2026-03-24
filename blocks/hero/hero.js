export default function decorate(block) {
  // Add Citi / AAdvantage co-brand logo just above the earning cards section
  // Anchored to page flow so it stays above the 1X card at any viewport size
  const section = block.closest('.hero-container');
  if (section && section === section.parentElement.querySelector('.hero-container:first-of-type')) {
    const cardsSection = document.querySelector('.section.dark-overlap, .section.dark');
    if (cardsSection) {
      cardsSection.style.position = 'relative';
      const logo = document.createElement('img');
      logo.src = './images/citi-aadvantage-logo.png';
      logo.alt = 'Citi and American Airlines AAdvantage Logo';
      logo.className = 'hero-cobrand-logo';
      logo.loading = 'eager';
      cardsSection.prepend(logo);
    }
  }
}
