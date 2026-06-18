import EnvelopeHero from "@/components/EnvelopeHero";
import Countdown from "@/components/Countdown";
import FunctionCards from "@/components/FunctionCards";
import Gallery from "@/components/Gallery";
import RSVPForm from "@/components/RSVPForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Divider from "@/components/Divider";

export default function Home() {
  return (
    <>
      {/* Sticky navigation */}
      <Navbar />

      {/* Section 1 — Hero / Envelope */}
      <EnvelopeHero />

      {/* Ornamental separator */}
      <Divider />

      {/* Section 2 — Countdown */}
      <Countdown />

      {/* Ornamental separator */}
      <Divider />

      {/* Section 3 — Function Cards */}
      <FunctionCards />

      {/* Ornamental separator */}
      <Divider />

      {/* Section 4 — Gallery */}
      <Gallery />

      {/* Ornamental separator */}
      <Divider />

      {/* Section 5 — RSVP */}
      <RSVPForm />

      {/* Section 6 — Footer */}
      <Footer />
    </>
  );
}
