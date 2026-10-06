import { ArrowUpRight } from 'lucide-react';
import vitalikPortrait from './assets/vitalik-buterin-techcrunch.jpg';

export default function SectionVitalik() {
  return (
    <section className="landing-vitalik-section" aria-labelledby="landing-vitalik-quote">
      <div className="landing-vitalik-inner">
        <div className="landing-vitalik-photo">
          <img src={vitalikPortrait} alt="Vitalik Buterin at TechCrunch Disrupt London in 2015" loading="eager" />
          <span>
            Photo: John Phillips / TechCrunch, CC BY 2.0, via{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Vitalik_Buterin_TechCrunch_London_2015_(cropped).jpg" target="_blank" rel="noopener noreferrer">
              Wikimedia Commons
            </a>
          </span>
        </div>
        <div className="landing-vitalik-copy">
          <blockquote id="landing-vitalik-quote">“Only Gladias and the restaurant knew that a 10.5 zipcoin order had been made.”</blockquote>
          <div className="landing-vitalik-attribution">
            <strong>Vitalik Buterin</strong>
            <span><em>The Cryptographic World Computer</em>, Chapter 6</span>
            <a href="https://vitalik.eth.limo/snowmoon/html/chapter-6.html" target="_blank" rel="noopener noreferrer">
              Read the original chapter <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <p>A reference to an idea, not an endorsement or partnership.</p>
        </div>
      </div>
    </section>
  );
}
