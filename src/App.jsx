import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  Car,
  Check,
  ChevronDown,
  FileQuestion,
  Globe2,
  HeartPulse,
  Home,
  Languages,
  MapPinned,
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
import {
  contactOptions,
  languages,
  marketStates,
  services,
  site,
  sourceLinks,
  stateOptions,
} from "./content";

const serviceIcons = {
  auto: Car,
  health: HeartPulse,
  medicare: Stethoscope,
  life: Umbrella,
  dental: Smile,
  home: Home,
};

const pageTypeMeta = {
  guide: { icon: BookOpen, es: "Guia", en: "Guide" },
  faq: { icon: FileQuestion, es: "FAQ", en: "FAQ" },
  types: { icon: BriefcaseBusiness, es: "Tipos de polizas", en: "Policy types" },
  availability: { icon: MapPinned, es: "Disponibilidad", en: "Availability" },
};

function initialForm(insuranceType = "health") {
  return {
    fullName: "",
    phone: "",
    email: "",
    insuranceType,
    city: "",
    state: "FL",
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

function pageUrl(path) {
  return `${site.url}${path === "/" ? "/" : path}`;
}

function routeForPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return { type: "home", path };

  for (const service of services) {
    const base = `/${service.slug}`;
    const faq = `/${service.id === "medicare" ? "medicare" : `${service.id}-insurance`}-faq`;
    const types = `/${service.id === "medicare" ? "medicare" : `${service.id}-insurance`}-types`;
    const availability = `/${service.id === "medicare" ? "medicare" : `${service.id}-insurance`}-availability`;
    if (path === base) return { type: "guide", service, path };
    if (path === faq) return { type: "faq", service, path };
    if (path === types) return { type: "types", service, path };
    if (path === availability) return { type: "availability", service, path };
  }

  return { type: "home", path: "/" };
}

function servicePaths(service) {
  const stem = service.id === "medicare" ? "medicare" : `${service.id}-insurance`;
  return {
    guide: `/${service.slug}`,
    faq: `/${stem}-faq`,
    types: `/${stem}-types`,
    availability: `/${stem}-availability`,
  };
}

function setMeta(name, value, attr = "name") {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

function useSeo(route, lang) {
  useEffect(() => {
    const l = languages[lang];
    const local = route.service?.[lang];
    const title =
      route.type === "home"
        ? lang === "es"
          ? "La Guia de Seguros | Guias bilingues de Auto, Salud, Medicare, Vida, Dental y Hogar"
          : "La Guia de Seguros | Bilingual Auto, Health, Medicare, Life, Dental and Home Guides"
        : route.type === "guide"
          ? local.seoTitle
          : `${local.title} ${pageTypeMeta[route.type][lang]} | La Guia de Seguros`;
    const description =
      route.type === "home"
        ? l.hero.text
        : route.type === "faq"
          ? `${local.title} FAQ: ${local.faqs.map(([q]) => q).slice(0, 3).join(", ")}.`
          : route.type === "types"
            ? lang === "es"
              ? `${local.title}: tipos de poliza explicados en espanol e ingles: ${local.policyTypes.map(([name]) => name).join(", ")}.`
              : `${local.title} policy types explained in English and Spanish: ${local.policyTypes.map(([name]) => name).join(", ")}.`
            : route.type === "availability"
              ? lang === "es"
                ? `${local.title}: disponibilidad y ejemplos para estados y condados hispanos principales, incluyendo ${marketStates.slice(0, 4).map((s) => s.state).join(", ")}.`
                : `${local.title} availability guidance for Hispanic hub states and counties including ${marketStates.slice(0, 4).map((s) => s.state).join(", ")}.`
              : local.description;

    const canonical = pageUrl(route.path);
    document.title = title;
    setMeta("description", description);
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1");
    setMeta("author", site.legalName);
    setMeta("keywords", "insurance guide, bilingual insurance, seguro de auto, seguro de hogar, seguro de vida, Medicare, health insurance, Hispanic insurance agents, MLC Insurance Agency");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", route.type === "home" ? "website" : "article", "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:image", `${site.url}${route.service?.image || "/images/health.png"}`, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setCanonical(canonical);
  }, [route, lang]);
}

function buildJsonLd(route, lang) {
  const l = languages[lang];
  const base = [
    {
      "@context": "https://schema.org",
      "@type": "InsuranceAgency",
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      telephone: site.phoneDisplay,
      areaServed: marketStates.map((s) => ({ "@type": "State", name: s.state })),
      sameAs: [site.chronos],
      knowsAbout: services.map((service) => service.en.title),
      availableLanguage: ["Spanish", "English"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      inLanguage: ["es-US", "en-US"],
      potentialAction: {
        "@type": "ContactAction",
        target: `${site.url}/#lead-form`,
        name: l.navCta,
      },
    },
  ];

  if (!route.service) return base;
  const local = route.service[lang];
  const paths = servicePaths(route.service);
  base.push({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: route.type === "guide" ? local.seoTitle : `${local.title} ${pageTypeMeta[route.type][lang]}`,
    description: local.description,
    image: `${site.url}${route.service.image}`,
    mainEntityOfPage: pageUrl(route.path),
    author: { "@type": "Organization", name: site.legalName },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    about: local.title,
    inLanguage: lang === "es" ? "es-US" : "en-US",
  });
  base.push({
    "@context": "https://schema.org",
    "@type": "Service",
    name: local.title,
    serviceType: local.title,
    provider: { "@type": "InsuranceAgency", name: site.legalName, url: site.url },
    areaServed: marketStates.map((s) => s.state),
    url: pageUrl(paths.guide),
  });
  base.push({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: local.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });
  return base;
}

function App() {
  const [lang, setLang] = useState("es");
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(() => routeForPath(window.location.pathname));
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const t = languages[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "es" ? "es-US" : "en-US";
    const onPop = () => setRoute(routeForPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [lang]);

  useEffect(() => {
    if (!route.service) return;
    setForm((current) =>
      current.insuranceType === route.service.id
        ? current
        : { ...current, insuranceType: route.service.id }
    );
  }, [route.service?.id]);

  useSeo(route, lang);

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.insuranceType) || services[0],
    [form.insuranceType]
  );

  function navigate(event, href) {
    if (href.includes("#")) return;
    if (!href.startsWith("/")) return;
    event.preventDefault();
    window.history.pushState({}, "", href);
    setRoute(routeForPath(href));
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
      setForm(initialForm(route.service?.id));
    } catch {
      setStatus("error");
      setMessage(t.error);
    }
  }

  return (
    <div className="site-shell">
      {buildJsonLd(route, lang).map((data, index) => (
        <JsonLd data={data} key={index} />
      ))}
      <Header
        lang={lang}
        setLang={setLang}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navigate={navigate}
      />
      <main id="top">
        {route.type === "home" ? (
          <HomePage lang={lang} chooseService={chooseService} navigate={navigate} />
        ) : (
          <ServicePage lang={lang} route={route} chooseService={chooseService} navigate={navigate} />
        )}
        <LeadSection
          lang={lang}
          form={form}
          status={status}
          message={message}
          update={update}
          handleSubmit={handleSubmit}
          selectedService={selectedService}
        />
        <FinalBand lang={lang} />
      </main>
      <Footer lang={lang} navigate={navigate} />
    </div>
  );
}

function Header({ lang, setLang, menuOpen, setMenuOpen, navigate }) {
  const t = languages[lang];
  const navItems = [
    ["/#coverage", t.nav[0]],
    ["/#guides", t.nav[1]],
    ["/#states", t.nav[2]],
    ["/#lead-form", t.nav[3]],
  ];
  return (
    <header className="topbar">
      <a className="brand" href="/" onClick={(event) => navigate(event, "/")} aria-label="La Guia de Seguros home">
        <img className="brand-logo" src="/logo-laguiadeseguros.png" alt="" />
        <span>
          <strong>La Guía</strong>
          <small>de Seguros</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label={t.mainNavigation}>
        {navItems.map(([href, label]) => (
          <a href={href} key={href}>{label}</a>
        ))}
      </nav>

      <div className="nav-actions">
        <button className="lang-toggle" type="button" onClick={() => setLang(lang === "es" ? "en" : "es")}>
          <Languages size={16} />
          {t.switchTo}
        </button>
        <a className="phone-link" href={`tel:${site.phoneTel}`}>
          <Phone size={16} />
          {site.phoneDisplay}
        </a>
        <a className="primary small" href="#lead-form">
          {t.navCta}
        </a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label={t.openMenu}>
          <Menu size={22} />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <button className="menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label={t.closeMenu}>
            <X size={22} />
          </button>
          {navItems.map(([href, label]) => (
            <a key={href} onClick={() => setMenuOpen(false)} href={href}>{label}</a>
          ))}
          <a onClick={() => setMenuOpen(false)} href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
          <a onClick={() => setMenuOpen(false)} href={site.chronosLogin}>{t.agentLogin}</a>
        </div>
      )}
    </header>
  );
}

function HomePage({ lang, chooseService, navigate }) {
  const t = languages[lang];
  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true">
          <img className="hero-main-img" src="/images/health.png" alt="" />
          <img className="hero-float hero-float-one" src="/images/auto.png" alt="" />
          <img className="hero-float hero-float-two" src="/images/home.png" alt="" />
        </div>
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            {t.hero.badge}
          </div>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.text}</p>
          <div className="hero-actions">
            <a className="primary" href="#lead-form">
              {t.hero.cta}
              <ArrowRight size={18} />
            </a>
            <a className="secondary" href="#guides">
              <BookOpen size={18} />
              {t.hero.secondary}
            </a>
          </div>
          <div className="proof-row">
            {t.hero.proof.map((item) => (
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
          <span className="section-kicker">{t.coverageKicker}</span>
          <h2>{t.sections.coverageTitle}</h2>
          <p>{t.sections.coverageText}</p>
        </div>
        <ServiceGrid lang={lang} chooseService={chooseService} navigate={navigate} />
      </section>

      <section className="guide-index" id="guides">
        <div className="section-heading compact">
          <span className="section-kicker">{t.guideHubKicker}</span>
          <h2>{t.guideHubTitle}</h2>
          <p>{t.guideHubText}</p>
        </div>
        <div className="guide-link-grid">
          {services.map((service) => {
            const paths = servicePaths(service);
            return (
              <article className="guide-link-card" key={service.id}>
                <img src={service.image} alt={service[lang].title} />
                <div>
                  <h3>{service[lang].title}</h3>
                  {Object.entries(paths).map(([type, href]) => {
                    const Icon = pageTypeMeta[type].icon;
                    return (
                      <a href={href} onClick={(event) => navigate(event, href)} key={href}>
                        <Icon size={16} />
                        {pageTypeMeta[type][lang]}
                      </a>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <StatesSection lang={lang} />
      <AiSearchSection lang={lang} />
    </>
  );
}

function ServiceGrid({ lang, chooseService, navigate }) {
  return (
    <div className="service-grid">
      {services.map((service) => {
        const Icon = serviceIcons[service.id];
        const local = service[lang];
        const paths = servicePaths(service);
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
              <div className="card-actions">
                <a href={paths.guide} onClick={(event) => navigate(event, paths.guide)}>
                  {languages[lang].readGuide}
                  <ArrowRight size={16} />
                </a>
                <button type="button" onClick={() => chooseService(service.id)}>
                  {languages[lang].useGuide}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ServicePage({ lang, route, chooseService, navigate }) {
  const service = route.service;
  const local = service[lang];
  const Icon = serviceIcons[service.id];
  const type = route.type;

  return (
    <>
      <section className={`guide-hero guide-${service.color}`}>
        <div className="guide-hero-copy">
          <a href="/" onClick={(event) => navigate(event, "/")} className="breadcrumb">
            {languages[lang].home}
          </a>
          <div className="eyebrow">
            <Icon size={16} />
            {pageTypeMeta[type][lang]}
          </div>
          <h1>{type === "guide" ? local.title : `${local.title}: ${pageTypeMeta[type][lang]}`}</h1>
          <p>{type === "guide" ? local.description : introForType(type, lang, local)}</p>
          <div className="hero-actions">
            <a className="primary" href="#lead-form" onClick={() => chooseService(service.id)}>
              {languages[lang].navCta}
              <ArrowRight size={18} />
            </a>
            <a className="secondary" href={`tel:${site.phoneTel}`}>
              <Phone size={18} />
              {languages[lang].call}
            </a>
          </div>
        </div>
        <img className="guide-hero-img" src={service.image} alt={local.title} />
      </section>

      <GuideNav lang={lang} service={service} active={type} navigate={navigate} />

      {type === "guide" && <MainGuide lang={lang} service={service} />}
      {type === "faq" && <FaqPage lang={lang} service={service} />}
      {type === "types" && <TypesPage lang={lang} service={service} />}
      {type === "availability" && <AvailabilityPage lang={lang} service={service} />}
    </>
  );
}

function introForType(type, lang, local) {
  if (type === "faq") return lang === "es" ? `Respuestas claras sobre ${local.title}, terminos, reclamos y cuando pedir ayuda.` : `Clear answers about ${local.title}, terms, claims, and when to ask for help.`;
  if (type === "types") return lang === "es" ? `Compara tipos de polizas y usos comunes antes de elegir cobertura.` : `Compare policy types and common use cases before choosing coverage.`;
  return lang === "es" ? `Disponibilidad y ejemplos para estados, condados y comunidades hispanas principales.` : `Availability and examples for major Hispanic hub states, counties, and communities.`;
}

function GuideNav({ lang, service, active, navigate }) {
  const paths = servicePaths(service);
  return (
    <nav className="guide-tabs" aria-label={`${service[lang].title} pages`}>
      {Object.entries(paths).map(([type, href]) => {
        const Icon = pageTypeMeta[type].icon;
        return (
          <a className={active === type ? "active" : ""} href={href} onClick={(event) => navigate(event, href)} key={href}>
            <Icon size={16} />
            {pageTypeMeta[type][lang]}
          </a>
        );
      })}
    </nav>
  );
}

function MainGuide({ lang, service }) {
  const local = service[lang];
  return (
    <section className="guide-content">
      <AnswerBlock title={languages[lang].quickAnswer} text={local.quick} />
      <article className="prose-panel">
        <h2>{languages[lang].whyCoverageMatters}</h2>
        <p>{local.intro}</p>
      </article>
      <SplitInfo lang={lang} local={local} />
      <LocalExamples lang={lang} local={local} />
    </section>
  );
}

function SplitInfo({ lang, local }) {
  return (
    <div className="split-info">
      <InfoList title={languages[lang].terminology} items={local.terms} />
      <InfoList title={languages[lang].whenToCall} items={local.callAgent.map((item) => [item, ""])} />
      <InfoList title={languages[lang].claimTitle} items={local.claim.map((item, index) => [`${index + 1}. ${item}`, ""])} />
    </div>
  );
}

function InfoList({ title, items }) {
  return (
    <article className="info-list">
      <h2>{title}</h2>
      <div>
        {items.map(([term, text]) => (
          <section key={term}>
            <h3>{term}</h3>
            {text && <p>{text}</p>}
          </section>
        ))}
      </div>
    </article>
  );
}

function LocalExamples({ lang, local }) {
  return (
    <article className="prose-panel">
      <h2>{languages[lang].examples}</h2>
      <div className="example-grid">
        {local.examples.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </article>
  );
}

function FaqPage({ lang, service }) {
  const local = service[lang];
  return (
    <section className="guide-content">
      <AnswerBlock title={languages[lang].quickAnswer} text={local.quick} />
      <div className="faq-list">
        {local.faqs.map(([question, answer]) => (
          <details open key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <SplitInfo lang={lang} local={local} />
    </section>
  );
}

function TypesPage({ lang, service }) {
  const local = service[lang];
  return (
    <section className="guide-content">
      <AnswerBlock
        title={languages[lang].choosePolicyType}
        text={languages[lang].choosePolicyText}
      />
      <div className="type-grid">
        {local.policyTypes.map(([name, text]) => (
          <article className="type-card" key={name}>
            <Building2 size={22} />
            <h2>{name}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <InfoList title={languages[lang].whenToCall} items={local.callAgent.map((item) => [item, ""])} />
    </section>
  );
}

function AvailabilityPage({ lang, service }) {
  const local = service[lang];
  return (
    <section className="guide-content">
      <AnswerBlock
        title={languages[lang].serviceAreas}
        text={lang === "es"
          ? `${local.title} esta disponible para consulta bilingue en los principales hubs hispanos de Estados Unidos. Las opciones especificas dependen de estado, condado, carrier y elegibilidad.`
          : `${local.title} bilingual consultation is available across major Hispanic hubs in the United States. Specific options depend on state, county, carrier, and eligibility.`}
      />
      <StatesSection lang={lang} compact />
      <LocalExamples lang={lang} local={local} />
      <Sources lang={lang} />
    </section>
  );
}

function AnswerBlock({ title, text }) {
  return (
    <article className="answer-block">
      <span>{title}</span>
      <p>{text}</p>
    </article>
  );
}

function StatesSection({ lang, compact = false }) {
  const t = languages[lang];
  return (
    <section className={compact ? "states-section compact-state-list" : "states-section"} id="states">
      {!compact && (
        <div className="section-heading">
          <span className="section-kicker">{t.statesKicker}</span>
          <h2>{t.sections.statesTitle}</h2>
          <p>{t.sections.statesText}</p>
        </div>
      )}
      <div className="state-grid">
        {marketStates.map((item, index) => (
          <article className="state-card" key={item.abbr}>
            <strong>{index + 1}. {item.state}</strong>
            <span>{item.hispanicPopulation} {t.hispanicResidents}</span>
            <p>{item.counties.join(", ")}</p>
            <small>{item.landmarks.slice(0, 4).join(" - ")}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function AiSearchSection({ lang }) {
  const t = languages[lang];
  return (
    <section className="ai-section">
      <Globe2 size={30} />
      <div>
        <span className="section-kicker">{t.aiKicker}</span>
        <h2>{t.sections.aiTitle}</h2>
        <p>{t.sections.aiText}</p>
        <div className="ai-links">
          <a href="/llms.txt">llms.txt</a>
          <a href="/llms-full.txt">llms-full.txt</a>
          <a href="/sitemap.xml">sitemap.xml</a>
        </div>
      </div>
    </section>
  );
}

function Sources({ lang }) {
  return (
    <article className="prose-panel sources">
      <h2>{languages[lang].sources}</h2>
      <p>{languages[lang].sourceText}</p>
      {sourceLinks.map((link) => (
        <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
          {link.label[lang]}
        </a>
      ))}
    </article>
  );
}

function LeadSection({ lang, form, status, message, update, handleSubmit, selectedService }) {
  const t = languages[lang];
  const SelectedIcon = serviceIcons[selectedService.id];
  return (
    <section className="lead-section" id="lead-form">
      <div className="lead-copy">
        <div className="selected-guide">
          <SelectedIcon size={22} />
          {selectedService[lang].title}
        </div>
        <h2>{t.formTitle}</h2>
        <p>{t.formText}</p>
        <p className="small-note">{t.formIntro}</p>
        <div className="contact-strip">
          <a href={`tel:${site.phoneTel}`}>
            <Phone size={17} />
            {site.phoneDisplay}
          </a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer">
            {t.whatsapp}
          </a>
        </div>
      </div>

      <form className="lead-form" onSubmit={handleSubmit}>
        <label className="hidden-field">
          {t.honeypot}
          <input value={form.company} onChange={(event) => update("company", event.target.value)} tabIndex="-1" autoComplete="off" />
        </label>

        <div className="field wide">
          <label htmlFor="insuranceType">{t.fields.insuranceType}</label>
          <Select id="insuranceType" value={form.insuranceType} onChange={(value) => update("insuranceType", value)}>
            {services.map((service) => (
              <option value={service.id} key={service.id}>
                {service[lang].title}
              </option>
            ))}
          </Select>
        </div>

        <Field id="fullName" label={t.fields.fullName} required value={form.fullName} update={update} />
        <Field id="phone" label={t.fields.phone} required value={form.phone} update={update} inputMode="tel" />
        <Field id="email" label={t.fields.email} required value={form.email} update={update} type="email" />
        <div className="field">
          <label htmlFor="preferredContact">{t.fields.preferredContact}</label>
          <Select id="preferredContact" value={form.preferredContact} onChange={(value) => update("preferredContact", value)}>
            {contactOptions.map((value) => (
              <option value={value} key={value}>{t.contactOptions[value]}</option>
            ))}
          </Select>
        </div>
        <Field id="city" label={t.fields.city} value={form.city} update={update} />
        <div className="field split">
          <div>
            <label htmlFor="state">{t.fields.state}</label>
            <Select id="state" value={form.state} onChange={(value) => update("state", value)}>
              {stateOptions.map((state) => (
                <option value={state} key={state}>{t.stateLabels[state] || state}</option>
              ))}
            </Select>
          </div>
          <Field id="zipCode" label={t.fields.zipCode} value={form.zipCode} update={update} inputMode="numeric" />
        </div>
        <Field id="householdSize" label={t.fields.householdSize} value={form.householdSize} update={update} inputMode="numeric" />
        <Field id="currentCoverage" label={t.fields.currentCoverage} value={form.currentCoverage} update={update} />
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
  );
}

function Field({ id, label, value, update, required = false, type = "text", inputMode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} required={required} type={type} inputMode={inputMode} value={value} onChange={(event) => update(id, event.target.value)} />
    </div>
  );
}

function Select({ id, value, onChange, children }) {
  return (
    <div className="select-wrap">
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
      <ChevronDown size={18} />
    </div>
  );
}

function FinalBand({ lang }) {
  const t = languages[lang];
  return (
    <section className="final-band">
      <Shield size={34} />
      <h2>{t.sections.finalTitle}</h2>
      <p>{t.sections.finalText}</p>
      <a className="primary" href="#lead-form">
        {t.navCta}
        <ArrowRight size={18} />
      </a>
    </section>
  );
}

function Footer({ lang, navigate }) {
  const t = languages[lang];
  const guideLinks = services.slice(0, 6).map((service) => [servicePaths(service).guide, service[lang].title]);
  return (
    <footer>
      <div>
        <p>La Guía de Seguros</p>
        <small>{t.poweredBy}</small>
      </div>
      <div className="footer-links">
        {guideLinks.map(([href, label]) => (
          <a href={href} onClick={(event) => navigate(event, href)} key={href}>{label}</a>
        ))}
        <a href={site.chronos}>ChronosCodex</a>
        <a href={site.chronosLogin}>{t.agentLogin}</a>
        <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
      </div>
    </footer>
  );
}

export default App;
