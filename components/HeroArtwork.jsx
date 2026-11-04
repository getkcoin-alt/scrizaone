import { BrandMark } from "./Brand";

// Decorative artwork, adapted from the reference site's layered orbital design.
// No simulated product metrics or additional service claims.
export default function HeroArtwork() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-core"><BrandMark /></div>
      <div className="art-chip chip-top"><span className="signal-dot" />Fintech</div>
      <div className="art-chip chip-bottom">AI & automation<span>↗</span></div>
      <span className="art-index">SCRIZAONE / ENGINEERING</span>
    </div>
  );
}
