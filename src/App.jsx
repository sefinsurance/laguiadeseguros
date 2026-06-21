import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Check,
  ChevronDown,
  HeartPulse,
  Home,
  Languages,
  Menu,
  Phone,
  Shield,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Umbrella,
  X,
} from "lucide-react";

const PHONE_DISPLAY = "877-458-2557";
const PHONE_TEL = "+18774582557";
const WHATSAPP_URL = "https://wa.me/18774582557";

const copy = {
  es: {
    nav: ["Coberturas", "Proceso", "Consulta"],
    navCta: "Cotizar ahora",
    heroBadge: "Guia bilingue de seguros",
    heroTitle: "Seguros claros para proteger lo que mas importa.",
    heroText:
      "Compara opciones de Auto, Salud, Medicare, Vida, Dental y Hogar con ayuda de asesores que hablan tu idioma.",
    heroCta: "Empezar mi guia",
    heroSecondary: "Llamar ahora",
    proof: ["Consulta sin costo", "Atencion en espanol e ingles", "Respuesta rapida"],
    formTitle: "Recibe orientacion personalizada",
    formText: "Completa tus datos y un asesor de MLC revisara tus opciones.",
    servicesTitle: "Elige la cobertura que necesitas",
    servicesText: "Cada guia esta pensada para hacer preguntas simples y llevar tu informacion directo al equipo correcto.",
    processTitle: "Como funciona",
    finalCta: "Listo para revisar tus opciones?",
    finalText: "Deja tus datos y convierte la busqueda de seguro en una conversacion clara.",
    submit: "Enviar solicitud",
    sending: "Enviando...",
    success: "Solicitud recibida. Un asesor te contactara pronto.",
    error: "No pudimos enviar la solicitud. Intenta nuevamente o llama al 877-458-2557.",
    consent:
      "Acepto que MLC me contacte por telefono, SMS o email sobre mi solicitud. Pueden aplicar tarifas de mensajes y datos.",
    fields: {
      fullName: "Nombre completo",
      phone: "Telefono",
      email: "Email",
      insuranceType: "Tipo de seguro",
      city: "Ciudad",
      state: "Estado",
      zipCode: "Codigo postal",
      preferredContact: "Preferencia de contacto",
      householdSize: "Personas en el hogar",
      currentCoverage: "Cobertura actual",
      message: "Que necesitas resolver?",
    },
  },
  en: {
    nav: ["Coverage", "Process", "Consultation"],
    navCta: "Start quote",
    heroBadge: "Bilingual insurance guide",
    heroTitle: "Clear insurance guidance for what matters most.",
    heroText:
      "Compare Auto, Health, Medicare, Life, Dental, and Home insurance options with advisors who speak your language.",
    heroCta: "Start my guide",
    heroSecondary: "Call now",
    proof: ["No-cost consultation", "English and Spanish support", "Fast response"],
    formTitle: "Get personalized guidance",
    formText: "Share your details and an MLC advisor will review your options.",
    servicesTitle: "Choose the coverage you need",
    servicesText: "Each guide asks simple questions and routes your information to the right team.",
    processTitle: "How it works",
    finalCta: "Ready to review your options?",
    finalText: "Leave your details and turn insurance shopping into a clear conversation.",
    submit: "Send request",
    sending: "Sending...",
    success: "Request received. An advisor will contact you soon.",
    error: "We could not send the request. Try again or call 877-458-2557.",
    consent:
      "I agree that MLC may contact me by phone, SMS, or email about my request. Message and data rates may apply.",
    fields: {
      fullName: "Full name",
      phone: "Phone",
      email: "Email",
      insuranceType: "Insurance type",
      city: "City",
      state: "State",
      zipCode: "ZIP code",
      preferredContact: "Contact preference",
      householdSize: "Household size",
      currentCoverage: "Current coverage",
      message: "What do you need help with?",
    },
  },
};

const services = [
  {
    id: "auto",
    icon: Car,
    image: "/images/auto.png",
    es: {
      title: "Seguro de Auto",
      summary: "Proteccion para manejar con confianza, desde cobertura basica hasta proteccion completa.",
      points: ["Responsabilidad civil", "Full cover", "Conductores y vehiculos multiples"],
    },
    en: {
      title: "Auto Insurance",
      summary: "Protection for the road, from basic liability to full coverage.",
      points: ["Liability", "Full coverage", "Multiple drivers and vehicles"],
    },
  },
  {
    id: "health",
    icon: HeartPulse,
    image: "/images/health.png",
    es: {
      title: "Seguro de Salud",
      summary: "Opciones para individuos y familias con enfoque en doctores, medicinas y presupuesto.",
      points: ["Planes ACA", "Familias", "Ayuda con subsidios"],
    },
    en: {
      title: "Health Insurance",
      summary: "Individual and family options centered on doctors, prescriptions, and budget.",
      points: ["ACA plans", "Families", "Subsidy guidance"],
    },
  },
  {
    id: "medicare",
    icon: Stethoscope,
    image: "/images/medicare.png",
    es: {
      title: "Medicare",
      summary: "Orientacion para Medicare Advantage, suplementos y Parte D sin confusiones.",
      points: ["Turning 65", "Advantage", "Part D"],
    },
    en: {
      title: "Medicare",
      summary: "Guidance for Medicare Advantage, supplements, and Part D without confusion.",
      points: ["Turning 65", "Advantage", "Part D"],
    },
  },
  {
    id: "life",
    icon: Umbrella,
    image: "/images/life.png",
    es: {
      title: "Seguro de Vida",
      summary: "Ayuda para proteger ingresos, familia y planes futuros con cobertura adecuada.",
      points: ["Term life", "Whole life", "Proteccion familiar"],
    },
    en: {
      title: "Life Insurance",
      summary: "Help protecting income, family, and future plans with the right coverage.",
      points: ["Term life", "Whole life", "Family protection"],
    },
  },
  {
    id: "dental",
    icon: Smile,
    image: "/images/dental.png",
    es: {
      title: "Seguro Dental",
      summary: "Planes para limpiezas, tratamientos mayores, ortodoncia y redes dentales.",
      points: ["Preventivo", "Tratamientos mayores", "Familias"],
    },
    en: {
      title: "Dental Insurance",
      summary: "Plans for cleanings, major work, orthodontics, and dentist networks.",
      points: ["Preventive", "Major work", "Families"],
    },
  },
  {
    id: "home",
    icon: Home,
    image: "/images/home.png",
    es: {
      title: "Seguro de Hogar",
      summary: "Cobertura para casa, pertenencias y responsabilidad ante eventos inesperados.",
      points: ["Casa", "Condo", "Flood review"],
    },
    en: {
      title: "Home Insurance",
      summary: "Coverage for your house, belongings, and liability when the unexpected happens.",
      points: ["House", "Condo", "Flood review"],
    },
  },
];

const contactOptions = [
  ["phone", "Phone / Llamada"],
  ["sms", "SMS"],
  ["whatsapp", "WhatsApp"],
  ["email", "Email"],
];

const states = ["AZ", "FL", "TX", "NC", "GA", "CA", "NV", "Other"];

function initialForm() {
  return {
    fullName: "",
    phone: "",
    email: "",
    insuranceType: "health",
    city: "",
    state: "AZ",
    zipCode: "",
    preferredContact: "phone",
    householdSize: "",
    currentCoverage: "",
    message: "",
    consent: false,
    company: "",
  };
}

function getUtm() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      .map((key) => [key, params.get(key)])
      .filter(([, value]) => value)
  );
}

function App() {
  const [lang, setLang] = useState("es");
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const t = copy[lang];

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.insuranceType) || services[0],
    [form.insuranceType]
  );
  const SelectedIcon = selectedService.icon;

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function chooseService(id) {
    update("insuranceType", id);
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          language: lang,
          pagePath: window.location.pathname,
          referrer: document.referrer,
          utm: getUtm(),
        }),
      });

      if (!response.ok) throw new Error("Lead request failed");
      setStatus("success");
      setMessage(t.success);
      setForm(initialForm());
    } catch (error) {
      setStatus("error");
      setMessage(t.error);
    }
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="La Guia de Seguros home">
          <span className="brand-mark">
            <ShieldCheck size={22} />
          </span>
          <span>
            <strong>La Guía</strong>
            <small>de Seguros</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#coverage">{t.nav[0]}</a>
          <a href="#process">{t.nav[1]}</a>
          <a href="#lead-form">{t.nav[2]}</a>
        </nav>

        <div className="nav-actions">
          <button className="lang-toggle" type="button" onClick={() => setLang(lang === "es" ? "en" : "es")}>
            <Languages size={16} />
            {lang === "es" ? "EN" : "ES"}
          </button>
          <a className="phone-link" href={`tel:${PHONE_TEL}`}>
            <Phone size={16} />
            {PHONE_DISPLAY}
          </a>
          <a className="primary small" href="#lead-form">
            {t.navCta}
          </a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <button className="menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
          <a onClick={() => setMenuOpen(false)} href="#coverage">{t.nav[0]}</a>
          <a onClick={() => setMenuOpen(false)} href="#process">{t.nav[1]}</a>
          <a onClick={() => setMenuOpen(false)} href="#lead-form">{t.nav[2]}</a>
          <a onClick={() => setMenuOpen(false)} href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
        </div>
      )}

      <main id="top">
        <section className="hero">
          <div className="hero-media" aria-hidden="true">
            <img className="hero-main-img" src="/images/health.png" alt="" />
            <img className="hero-float hero-float-one" src="/images/auto.png" alt="" />
            <img className="hero-float hero-float-two" src="/images/home.png" alt="" />
          </div>

          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={16} />
              {t.heroBadge}
            </div>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-actions">
              <a className="primary" href="#lead-form">
                {t.heroCta}
                <ArrowRight size={18} />
              </a>
              <a className="secondary" href={`tel:${PHONE_TEL}`}>
                <Phone size={18} />
                {t.heroSecondary}
              </a>
            </div>
            <div className="proof-row">
              {t.proof.map((item) => (
                <span key={item}>
                  <Check size={16} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="coverage-band" id="coverage">
          <div className="section-heading">
            <span className="section-kicker">Auto - Health - Medicare - Life - Dental - Home</span>
            <h2>{t.servicesTitle}</h2>
            <p>{t.servicesText}</p>
          </div>

          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              const local = service[lang];
              return (
                <article className="service-card" key={service.id}>
                  <img src={service.image} alt={local.title} />
                  <div className="service-body">
                    <div className="service-icon">
                      <Icon size={22} />
                    </div>
                    <h3>{local.title}</h3>
                    <p>{local.summary}</p>
                    <ul>
                      {local.points.map((point) => (
                        <li key={point}>
                          <BadgeCheck size={15} />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => chooseService(service.id)}>
                      {lang === "es" ? "Quiero esta guia" : "Use this guide"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="process" id="process">
          <div className="section-heading compact">
            <span className="section-kicker">MLC lead routing</span>
            <h2>{t.processTitle}</h2>
          </div>
          <div className="steps">
            {[
              lang === "es" ? "Elige la cobertura" : "Choose coverage",
              lang === "es" ? "Comparte tus datos" : "Share your details",
              lang === "es" ? "Un asesor revisa opciones" : "An advisor reviews options",
            ].map((step, index) => (
              <div className="step" key={step}>
                <span>{index + 1}</span>
                <h3>{step}</h3>
                <p>
                  {lang === "es"
                    ? "Tu solicitud llega organizada al CRM para seguimiento rapido."
                    : "Your request arrives organized in the CRM for quick follow-up."}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="lead-section" id="lead-form">
          <div className="lead-copy">
            <div className="selected-guide">
              <SelectedIcon size={22} />
              {selectedService[lang].title}
            </div>
            <h2>{t.formTitle}</h2>
            <p>{t.formText}</p>
            <div className="contact-strip">
              <a href={`tel:${PHONE_TEL}`}>
                <Phone size={17} />
                {PHONE_DISPLAY}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </div>

          <form className="lead-form" onSubmit={handleSubmit}>
            <label className="hidden-field">
              Company
              <input value={form.company} onChange={(event) => update("company", event.target.value)} tabIndex="-1" autoComplete="off" />
            </label>

            <div className="field wide">
              <label htmlFor="insuranceType">{t.fields.insuranceType}</label>
              <div className="select-wrap">
                <select id="insuranceType" value={form.insuranceType} onChange={(event) => update("insuranceType", event.target.value)}>
                  {services.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service[lang].title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="fullName">{t.fields.fullName}</label>
              <input id="fullName" required value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="phone">{t.fields.phone}</label>
              <input id="phone" required inputMode="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="email">{t.fields.email}</label>
              <input id="email" required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="preferredContact">{t.fields.preferredContact}</label>
              <div className="select-wrap">
                <select id="preferredContact" value={form.preferredContact} onChange={(event) => update("preferredContact", event.target.value)}>
                  {contactOptions.map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="city">{t.fields.city}</label>
              <input id="city" value={form.city} onChange={(event) => update("city", event.target.value)} />
            </div>
            <div className="field split">
              <div>
                <label htmlFor="state">{t.fields.state}</label>
                <div className="select-wrap">
                  <select id="state" value={form.state} onChange={(event) => update("state", event.target.value)}>
                    {states.map((state) => (
                      <option value={state} key={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} />
                </div>
              </div>
              <div>
                <label htmlFor="zipCode">{t.fields.zipCode}</label>
                <input id="zipCode" inputMode="numeric" value={form.zipCode} onChange={(event) => update("zipCode", event.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="householdSize">{t.fields.householdSize}</label>
              <input id="householdSize" inputMode="numeric" value={form.householdSize} onChange={(event) => update("householdSize", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="currentCoverage">{t.fields.currentCoverage}</label>
              <input id="currentCoverage" value={form.currentCoverage} onChange={(event) => update("currentCoverage", event.target.value)} />
            </div>
            <div className="field wide">
              <label htmlFor="message">{t.fields.message}</label>
              <textarea id="message" rows="4" value={form.message} onChange={(event) => update("message", event.target.value)} />
            </div>

            <label className="consent">
              <input type="checkbox" required checked={form.consent} onChange={(event) => update("consent", event.target.checked)} />
              <span>{t.consent}</span>
            </label>

            <button className="primary form-submit" type="submit" disabled={status === "sending"}>
              {status === "sending" ? t.sending : t.submit}
              <ArrowRight size={18} />
            </button>

            {message && <p className={`form-message ${status}`}>{message}</p>}
          </form>
        </section>

        <section className="final-band">
          <Shield size={34} />
          <h2>{t.finalCta}</h2>
          <p>{t.finalText}</p>
          <a className="primary" href="#lead-form">
            {t.navCta}
            <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer>
        <p>La Guía de Seguros</p>
        <p>
          <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a> · <a href={WHATSAPP_URL}>WhatsApp</a> · <a href="https://chronoscodex.com/login">Agent Login</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
