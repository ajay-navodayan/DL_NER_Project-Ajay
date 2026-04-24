import { useEffect, useState } from "react";

function Navigation() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ["home", "research", "process"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navigation ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="nav-brand" onClick={() => scrollToSection("home")}>
          <div className="nav-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 16h8M16 12v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="nav-title">Clinical NER</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${activeSection === "home" ? "active" : ""}`}
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeSection === "research" ? "active" : ""}`}
            onClick={() => scrollToSection("research")}
          >
            Research
          </button>
          <button
            className={`nav-link ${activeSection === "process" ? "active" : ""}`}
            onClick={() => scrollToSection("process")}
          >
            Process
          </button>
        </div>

        <button className="nav-cta" onClick={() => scrollToSection("process")}>
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default Navigation;
