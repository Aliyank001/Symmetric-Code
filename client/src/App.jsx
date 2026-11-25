import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight, FolderOpen, MessageCircle, Minus, Plus, Send, X } from 'lucide-react';
import SEO from './components/SEO.jsx';
import Turnstile from './components/Turnstile.jsx';
import { blogPosts } from './data/blogPosts.js';
import { emailConfig } from './data/emailConfig.js';
import { legalDocs } from './data/legalDocs.js';
import { faqs, projects, services, team } from './data/site.js';
import { solutions } from './data/solutions.js';

const fadeUp = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: .65, ease: [.22, 1, .36, 1] } } };
const wrap = { hidden: {}, visible: { transition: { staggerChildren: .11 } } };
function safeUrl(value, githubOnly = false) { try { const url = new URL(value); if (!['https:', 'http:'].includes(url.protocol)) return null; if (githubOnly && url.hostname !== 'github.com') return null; return url.href; } catch { return null; } }
const projectCardTones = ['#2b3027', '#421e2d', '#38251d', '#202842'];

function LoadingIntro(){const tiles=['brand','systems','web','ideas','motion'];const wordmarkTransition={layout:{type:'spring',stiffness:115,damping:25,mass:1}};return <motion.div className="intro-overlay" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.28,ease:[.22,1,.36,1]}} aria-label="Symmetric Code" role="status"><div className="intro-kicker"><span>SYMMETRIC CODE</span><span>DESIGN / BUILD / GROW</span></div><div className="intro-card-stack" aria-hidden="true">{tiles.map((tile,i)=><motion.div className={`intro-tile intro-tile-${i+1}`} key={tile} initial={{y:100,opacity:0,rotate:(i-2)*12,scale:.9}} animate={{y:0,opacity:1,rotate:(i-2)*7,scale:1}} transition={{duration:.62,delay:.06+i*.055,ease:[.22,1,.36,1]}}><span>{['SC','01','{ }','↗','✳'][i]}</span></motion.div>)}</div><motion.h1 className="intro-wordmark" layoutId="symmetric-code-wordmark" transition={wordmarkTransition}>SYMMETRIC CODE</motion.h1><motion.p className="intro-caption" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.3,duration:.35}}>Software for the way you work</motion.p><motion.div className="intro-progress"><motion.span initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:.95,ease:'easeInOut'}}/></motion.div></motion.div>}

function Header({introActive=false}) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [portalReady, setPortalReady] = useState(false);
  const nav = [
    { label: 'Services', href: '/services', children: services.map(item => [item.title, `/services/${item.slug}`]) },
    { label: 'Industries', href: '/solutions', children: solutions.map(item => [item.label, `/solutions/${item.slug}`]) },
    { label: 'Work', href: '/work' }, ['Pricing', '/pricing'], ['About', '/about'], ['Insights', '/insights'],
  ].map(item => Array.isArray(item) ? { label: item[0], href: item[1] } : item);
  const closeMenu = () => { setOpen(false); setOpenGroup(null); };
  useEffect(() => setPortalReady(true), []);
  useEffect(() => {
    if (!open) return undefined;
    const body = document.body;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const previousBody = { position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, width: body.style.width, overflow: body.style.overflow, overscrollBehavior: body.style.overscrollBehavior };
    const previousRoot = { overflow: root.style.overflow, overscrollBehavior: root.style.overscrollBehavior };
    root.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    const preventBackgroundTouchScroll = event => {
      if (!event.target.closest?.('.nav-links')) event.preventDefault();
    };
    document.addEventListener('touchmove', preventBackgroundTouchScroll, { passive: false });
    const handleKeyDown = event => { if (event.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      Object.assign(body.style, previousBody);
      Object.assign(root.style, previousRoot);
      document.removeEventListener('touchmove', preventBackgroundTouchScroll);
      window.removeEventListener('keydown', handleKeyDown);
      window.scrollTo(0, scrollY);
    };
  }, [open]);
  return <><header className={open ? 'site-header menu-open' : 'site-header'}><div className="nav-shell">
    <Link to="/" className="brand" onClick={closeMenu}><span className="brand-mark"><img src="/images/symmetric-code-mark.png" alt="" /></span><motion.span layoutId="symmetric-code-wordmark" className="brand-name" style={{opacity:introActive?0:1}} transition={{layout:{type:'spring',stiffness:115,damping:25,mass:1},opacity:{duration:.25,delay:introActive?0:.45}}}>SYMMETRIC CODE</motion.span></Link>
    <nav className={open ? 'nav-links open' : 'nav-links'}>{nav.map(({label,href,children})=><div className={children?'nav-entry has-mobile-dropdown':'nav-entry'} key={href}>
      <NavLink className="desktop-nav-item" to={href} onClick={closeMenu}>{label}</NavLink>
      {children&&<div className="mobile-nav-group"><div className="mobile-nav-group-heading"><NavLink to={href} onClick={closeMenu}>{label}</NavLink><button type="button" aria-label={`${openGroup===href?'Collapse':'Expand'} ${label}`} aria-expanded={openGroup===href} onClick={()=>setOpenGroup(current=>current===href?null:href)}><ChevronDown size={17}/></button></div><AnimatePresence initial={false}>{openGroup===href&&<motion.div className="mobile-nav-submenu" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.22,ease:[.22,1,.36,1]}}>{children.map(([child,childHref])=><NavLink key={childHref} to={childHref} onClick={closeMenu}>{child}<ArrowUpRight size={13}/></NavLink>)}</motion.div>}</AnimatePresence></div>}
    </div>)}<Link className="mobile-cta" to="/contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={16}/></Link></nav>
    <Link className="nav-cta" to="/contact">Let’s talk <ArrowUpRight size={15}/></Link>
    <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}><span className="hamburger-lines" aria-hidden="true"><i/><i/><i/></span></button>
  </div></header>{portalReady&&createPortal(<AnimatePresence>{open&&<motion.button type="button" className="nav-backdrop" aria-label="Close navigation" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}} onClick={closeMenu}/>}</AnimatePresence>,document.body)}</>;
}

function Footer() {
  return <footer className="footer"><div className="footer-main"><div><Link to="/" className="brand footer-brand"><span className="brand-mark"><img src="/images/symmetric-code-mark.png" alt="" /></span><span className="brand-name">SYMMETRIC CODE</span></Link><p>Thoughtful software for businesses ready to move forward.</p></div><div className="footer-links"><div><span className="eyebrow">EXPLORE</span><Link to="/services">Services</Link><Link to="/solutions">Industries</Link><Link to="/work">Selected work</Link><Link to="/pricing">Pricing approach</Link><Link to="/about">About us</Link><Link to="/insights">Insights</Link></div><div><span className="eyebrow">SAY HELLO</span><a href="mailto:symmetriccode01@gmail.com">symmetriccode01@gmail.com</a><a href="tel:+923083504631">+92 308 3504631</a><Link to="/contact">Book a conversation <ArrowUpRight size={14}/></Link></div><div><span className="eyebrow">POLICIES</span><Link to="/legal/terms">Terms & conditions</Link><Link to="/legal/privacy">Privacy policy</Link><Link to="/legal/cookies">Cookie policy</Link><Link to="/legal/service-agreement">Service agreement</Link><Link to="/legal/disclaimer">Disclaimer</Link></div></div></div><div className="footer-wordmark" aria-hidden="true">SYMMETRIC CODE</div><div className="footer-bottom"><span>© {new Date().getFullYear()} Symmetric Code</span><span>Made with care <span className="status-dot"/> Open to international projects</span></div></footer>;
}

function ProjectVisual({ project }) {
  return <div className={`project-visual project-visual-${project.id}`}>
    <img src={project.image} alt={`${project.title} project preview`} loading="lazy" />
    <span className="project-type">{project.type}</span>
    <span className="project-sector">{project.category}</span>
  </div>;
}

function ProjectCard({ project }) {
  const liveUrl = safeUrl(project.liveUrl);
  const githubUrl = safeUrl(project.githubUrl, true);
  return <motion.article className="project-card" variants={fadeUp}><ProjectVisual project={project}/><div className="project-info"><div><span className="eyebrow">{project.category}</span><h3>{project.title}</h3><p>{project.description}</p></div></div><div className="project-actions">{liveUrl&&<a href={liveUrl} target="_blank" rel="noopener noreferrer">Visit live site <ArrowUpRight size={15}/></a>}{githubUrl&&<a href={githubUrl} target="_blank" rel="noopener noreferrer">Source code <ArrowUpRight size={15}/></a>}</div></motion.article>;
}

function MobileProjectDeck() {
  const visibleProjects = projects.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const stackRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const updateActiveCard = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = stackRef.current?.querySelectorAll('.home-project-stack-item');
        if (!items?.length) return;
        const focusY = window.innerHeight * .58;
        let closestIndex = 0;
        let closestDistance = Infinity;
        items.forEach((item, index) => {
          const card = item.querySelector('.home-project-card');
          if (!card) return;
          const rect = card.getBoundingClientRect();
          if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
          const distance = Math.abs(rect.top + rect.height / 2 - focusY);
          if (distance < closestDistance) { closestDistance = distance; closestIndex = index; }
        });
        setActiveIndex(current => current === closestIndex ? current : closestIndex);
      });
    };
    window.addEventListener('scroll', updateActiveCard, { passive: true });
    window.addEventListener('resize', updateActiveCard);
    updateActiveCard();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateActiveCard);
      window.removeEventListener('resize', updateActiveCard);
    };
  }, []);

  const advance = index => {
    const target = index < visibleProjects.length - 1
      ? stackRef.current?.querySelector(`#home-project-${index + 1}`)
      : stackRef.current?.querySelector('#home-projects-all');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="home-project-stack" ref={stackRef} aria-label="Selected projects">
    {visibleProjects.map((project, index) => {
      const liveUrl = safeUrl(project.liveUrl);
      const depth = (index - activeIndex + visibleProjects.length) % visibleProjects.length;
      const depthStyles = [
        { opacity: 1, scale: 1, y: 0, rotate: 0 },
        { opacity: .7, scale: .95, y: -12, rotate: -4 },
        { opacity: .4, scale: .9, y: -22, rotate: 5 },
        { opacity: .2, scale: .85, y: -32, rotate: -7 },
      ][depth];
      return <div className={`home-project-stack-item${index === visibleProjects.length - 1 ? ' is-last' : ''}`} id={`home-project-${index}`} style={{ '--stack-index': index, '--card-tone': projectCardTones[index] }} key={project.id}>
        <motion.div className="home-project-card" style={{ '--card-tone': projectCardTones[index], zIndex: 10 - depth }} animate={depthStyles} transition={{ type: 'spring', stiffness: 260, damping: 24, mass: .9 }}>
          <motion.button className="home-project-card-main" type="button" onClick={() => advance(index)} whileTap={{ scale: .97 }} transition={{ type: 'spring', stiffness: 260, damping: 24, mass: .9 }} aria-label={`Show the next project after ${project.title}`}>
            <span className="home-project-card-head"><FolderOpen size={20} strokeWidth={1.7}/></span>
            <h3>{project.title}</h3>
            <span className="home-project-card-image"><img src={project.image} alt={`${project.title} preview`} loading="lazy"/><span className="home-project-card-badge"><i/> {project.category}</span></span>
            <span className="home-project-card-description">{project.description}</span>
          </motion.button>
          {liveUrl&&<a className="home-project-card-action" href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title}`} onClick={event=>event.stopPropagation()}><ArrowUpRight size={18}/></a>}
        </motion.div>
      </div>;
    })}
    <Link className="home-project-end" id="home-projects-all" to="/work">View all projects <ArrowUpRight size={17}/></Link>
  </div>;
}

const homeProjectHighlights = [
  { id: 'skin-laser-clinic', eyebrow: 'HEALTHCARE / DR. HINA', title: 'Zahra Clinic website', summary: 'A clinic website presenting treatments, service information and a clear appointment enquiry path.', focus: 'Clinic services · Appointment enquiries' },
  { id: 'client-requirement', eyebrow: 'TOOLS & PLATFORMS / AALIYAN', title: 'Client Requirement portal', summary: 'A guided portal that helps clients describe website needs, review their answers and share a project brief.', focus: 'Guided intake · Shareable project brief' },
  { id: 'cafe', eyebrow: 'FOOD & HOSPITALITY / CAFÉ AROMA', title: 'Café Aroma website', summary: 'A café experience with an interactive menu, featured specials, a photo gallery and clear contact actions.', focus: 'Interactive menu · Contact and ordering CTA' },
];

function HomeProjectHighlights(){
  const featured = homeProjectHighlights.map(item => ({...item, project: projects.find(project => project.id === item.id)})).filter(item => item.project);
  return <section className="section home-project-highlights" aria-labelledby="home-project-highlights-title">
    <div className="section-heading">
      <div><span className="eyebrow">PROJECT HIGHLIGHTS / 01—03</span><h2 id="home-project-highlights-title">Built around<br/><em>real workflows.</em></h2></div>
      <p>Three selected projects, each shaped around a different business need.</p>
    </div>
    <div className="home-highlight-grid">
      {featured.map(({id,eyebrow,title,summary,focus,project})=><article className="home-highlight-card" key={id}>
        <a className="home-highlight-image" href={project.liveUrl||'/work'} target={project.liveUrl?'_blank':undefined} rel={project.liveUrl?'noreferrer':undefined} aria-label={`Open ${title}`}>
          <img src={project.image} alt={`${title} project preview`} loading="lazy"/>
          <span className="home-highlight-open"><ArrowUpRight size={18}/></span>
        </a>
        <div className="home-highlight-copy"><span className="eyebrow">{eyebrow}</span><h3>{title}</h3><p>{summary}</p><span className="home-highlight-focus">{focus}</span></div>
      </article>)}
    </div>
    <Link className="text-link home-highlights-link" to="/work">Explore all projects <ArrowUpRight size={16}/></Link>
  </section>;
}

function Home() {
 return <><SEO title="Business Websites, Apps & Software Development" description="Symmetric Code builds business websites, mobile apps, POS systems, custom software and workflow automation for growing businesses. Discuss your project with our team."/>
  <main>
   <section className="hero"><div className="hero-inner"><motion.div className="hero-copy" initial="hidden" animate="visible" variants={wrap}>
     <motion.div className="availability" variants={fadeUp}><span className="pulse-dot"/> A 5-person product team, ready to collaborate</motion.div>
     <motion.h1 variants={fadeUp}>Good software<br/><span>moves business.</span></motion.h1>
     <motion.p variants={fadeUp}>We design and build websites, apps and business systems that make everyday work simpler—and help your next idea take shape.</motion.p>
     <motion.div className="hero-actions" variants={fadeUp}><Link className="button button-dark" to="/contact">Talk about your project <ArrowUpRight size={17}/></Link><Link className="text-link" to="/work">Explore our work <ArrowDownRight size={17}/></Link></motion.div>
     <motion.div className="hero-footnote" variants={fadeUp}><span className="avatar-stack"><i>A</i><i>T</i><i>R</i><i>+</i></span><span>One close-knit team.<br/><b>From first sketch to launch.</b></span><span className="hero-index">01 <i/> 04</span></motion.div>
   </motion.div>
   <motion.div className="hero-showcase" initial={{opacity:0, y:30}} animate={{opacity:1,y:0}} transition={{duration:.9, delay:.25}}>
     <div className="showcase-orbit orbit-one"/><div className="showcase-orbit orbit-two"/>
     <motion.div className="floating-chip chip-top" animate={{y:[0,-7,0], rotate:[0,2,0]}} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}><span className="chip-icon purple">⌘</span><span>Built around<br/><b>your workflow</b></span><ArrowUpRight size={14}/></motion.div>
     <motion.div className="floating-chip chip-bottom" animate={{y:[0,8,0], rotate:[0,-2,0]}} transition={{duration:6,repeat:Infinity,ease:'easeInOut'}}><span className="chip-icon lime">↗</span><span>Clearer systems.<br/><b>Better workdays.</b></span></motion.div>
     <div className="showcase-main"><div className="showcase-label"><span>SYMMETRIC / STUDIO</span><span>SC—01</span></div><div className="showcase-glyph"><div className="glyph-grid">{Array.from({length:25},(_,i)=><i key={i}/>)}</div><div className="glyph-center"><span className="g-arc arc-a"/><span className="g-arc arc-b"/><span className="g-cross">✳</span><span className="glyph-caption">INTENT<br/>INTO<br/>IMPACT</span></div></div><div className="showcase-bottom"><span>DESIGN　↗　BUILD　↗　GROW</span><span>TEAM OF 05</span></div></div>
     <div className="showcase-sticker">Thoughtful<br/>by design <span>✳</span></div>
   </motion.div></div>
   <div className="hero-bottom"><span>SOFTWARE FOR THE WAY YOU WORK</span><span>SCROLL TO EXPLORE <ArrowDownRight size={14}/></span></div></section>

   <section className="trust-strip"><span className="eyebrow">A SMALL TEAM FOR BIG IDEAS</span><div className="trust-services"><span>Websites</span><i>✳</i><span>Mobile apps</span><i>✳</i><span>POS & software</span><i>✳</i><span>Automation</span></div></section>

   <section className="section section-work" id="work">
     <div className="home-work-desktop">
       <div className="home-work-copy"><span className="eyebrow">SELECTED WORK / FROM OUR TEAM</span><h2>Our vision for<br/><em>business technology.</em></h2><p>A selection of websites and digital tools made to solve real business needs. Open a project to explore the work, or browse the complete portfolio.</p><Link className="text-link" to="/work">Explore all projects <ArrowUpRight size={16}/></Link></div>
       <div className="work-folder" aria-label="Selected projects folder">
         <div className="work-folder-tabs"><span className="work-folder-tab active">Business</span><span className="work-folder-tab">Selected work</span><Link className="work-folder-action" to="/work">View all projects</Link></div>
         <div className="work-folder-grid">{projects.slice(0,6).map((project,index)=><a className={`work-folder-project work-folder-project-${index+1}`} key={project.id} href={project.liveUrl||'/work'} target={project.liveUrl?'_blank':undefined} rel={project.liveUrl?'noreferrer':undefined} aria-label={`Open ${project.title}`}><img src={project.image} alt="" loading="lazy"/><span className="work-folder-project-label"><small>{project.category}</small><b>{project.title}</b></span></a>)}</div>
         <div className="work-folder-foot"><span>PROJECT LIBRARY</span><span>01—06 <i/> 0{projects.length}</span></div>
       </div>
     </div>
     <div className="home-work-mobile"><div className="section-heading"><div><span className="eyebrow">SELECTED WORK / FROM OUR TEAM</span><h2>Thoughtful digital<br/>work, out in the world<span className="lime-dot">.</span></h2></div><Link className="text-link" to="/work">See all projects <ArrowUpRight size={16}/></Link></div>
       <motion.div className="project-grid" variants={wrap} initial="hidden" whileInView="visible" viewport={{once:true,amount:.12}}>{projects.slice(0,2).map((p,i)=><ProjectCard project={p} index={i} key={p.id}/>)}</motion.div>
       <MobileProjectDeck/>
     </div>
   </section>

   <section className="section services-section"><div className="services-intro"><span className="eyebrow">WHAT WE DO</span><h2>From first idea<br/>to <em>working software.</em></h2><p>One connected team to help you plan, design, build and improve the tools your business depends on.</p><Link className="text-link" to="/services">Explore our services <ArrowUpRight size={16}/></Link></div><div className="service-list">{services.map(s=><Link className="service-row" to={`/services/${s.slug}`} key={s.id}><span className="service-number">{s.number}</span><div><h3>{s.title}</h3><p>{s.short}</p></div><span className="service-arrow"><ArrowUpRight size={19}/></span></Link>)}</div></section>

   <section className="industry-band"><div><span className="eyebrow">BUILT FOR REAL-WORLD BUSINESS</span><h2>Technology should fit<br/>your business—not the other way around.</h2></div><div className="industry-chips">{solutions.map(item=><Link to={`/solutions/${item.slug}`} key={item.slug}>{item.label}</Link>)}</div></section>

   <section className="section process-section"><div className="section-heading"><div><span className="eyebrow">HOW WE WORK</span><h2>Clear steps.<br/>No mystery.</h2></div><p>Good results start with listening. We keep you involved from the first conversation through launch and beyond.</p></div><div className="process-grid">{[['01','Understand','We learn how your business works, who it serves, and what needs to get better.'],['02','Shape','Together we define the scope, experience and priorities before building.'],['03','Build','We create in focused steps, share progress, and refine with your feedback.'],['04','Launch','We help you launch with confidence and support the next improvements.']].map(([n,t,d])=><article key={n}><span>{n}</span><div className="process-line"/><h3>{t}</h3><p>{d}</p></article>)}</div></section>

   <HomeProjectHighlights/>
   <section className="cta-band"><div className="cta-orb" aria-hidden="true"><svg viewBox="0 0 100 100" focusable="false"><path d="M50 5v90M5 50h90M18 18l64 64M82 18 18 82"/></svg></div><div><span className="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let’s make it<br/><em>work beautifully.</em></h2></div><Link className="button button-light" to="/contact">Start a conversation <ArrowUpRight size={17}/></Link></section>
  </main><Footer/><StaticAssistant/></>;
}

function ServicesPage() { return <><SEO title="Website, App, POS & Automation Services" path="/services" description="Compare website development, mobile apps, POS and custom software, AI solutions and business automation services from Symmetric Code."/><main className="inner-page"><section className="inner-hero"><span className="eyebrow">CAPABILITIES / 01—05</span><h1>Software that fits<br/><em>the way you work.</em></h1><p>Practical digital products for the moments when your current tools aren't quite enough.</p></section><section className="service-detail-list">{services.map(s=><article id={s.id} key={s.id}><span className="service-number">{s.number}</span><div><h2>{s.title}</h2><p>{s.short}</p><div className="tag-row">{s.tags.map(t=><span key={t}>{t}</span>)}</div></div><Link className="round-arrow" to={`/services/${s.slug}`} aria-label={`Explore ${s.title}`}><ArrowUpRight/></Link></article>)}</section><ContactBanner/></main><Footer/><StaticAssistant/></> }

function SolutionsHub(){return <><SEO title="Clinic, Real Estate & Industry Software" path="/solutions" description="Industry-focused websites and software for clinics, real estate companies, construction teams and home service businesses."/><main className="inner-page"><section className="inner-hero"><span className="eyebrow">INDUSTRIES / 01—04</span><h1>Technology for<br/><em>the work you do.</em></h1><p>Explore how websites, custom software and automation can support the way your industry operates. Every project starts with your specific workflow.</p></section><div className="solution-grid">{solutions.map((item,i)=><Link to={`/solutions/${item.slug}`} className="solution-card" key={item.slug}><span className="eyebrow">SOLUTION / 0{i+1}</span><h2>{item.label}</h2><p>{item.description}</p><span className="text-link">Explore this solution <ArrowUpRight size={15}/></span></Link>)}</div><ContactBanner/></main><Footer/><StaticAssistant/></>}

function SolutionPage(){const {slug}=useParams();const solution=solutions.find(item=>item.slug===slug);if(!solution)return <NotFound/>;return <><SEO title={solution.seoTitle||solution.title} path={`/solutions/${solution.slug}`} description={solution.seoDescription||solution.description} faqItems={solution.faqs} serviceData={solution}/><main className="inner-page"><nav className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13}/><Link to="/solutions">Industries</Link><ChevronRight size={13}/><span>{solution.label}</span></nav><section className="service-hero"><span className="eyebrow">INDUSTRY / {solution.label.toUpperCase()}</span><h1>{solution.title}<br/><em>for your workflow.</em></h1><p>{solution.intro}</p><div className="hero-actions"><Link className="button button-dark" to="/contact">Discuss your business <ArrowUpRight size={16}/></Link><Link className="text-link" to="/work">See related work <ArrowUpRight size={15}/></Link></div></section><section className="solution-content"><div><span className="eyebrow">POSSIBLE BUILDING BLOCKS</span><h2>Start with what<br/>your business needs.</h2></div><div className="service-outcomes">{solution.points.map((item,i)=><div key={item}><span>0{i+1}</span><p>{item}</p><Check size={16}/></div>)}</div></section><section className="faq-section service-faq"><div><span className="eyebrow">{solution.label.toUpperCase()} QUESTIONS</span><h2>Common questions,<br/>clear answers.</h2></div><FAQList items={solution.faqs}/></section><ContactBanner/></main><Footer/><StaticAssistant/></>}

function ServicePage(){const {slug}=useParams();const service=services.find(s=>s.slug===slug);if(!service)return <NotFound/>;return <><SEO title={service.seoTitle||service.title} path={`/services/${service.slug}`} description={service.seoDescription||service.short} faqItems={service.faqs} serviceData={service}/><main className="inner-page"><nav className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13}/><Link to="/services">Services</Link><ChevronRight size={13}/><span>{service.title}</span></nav><section className="service-hero"><span className="eyebrow">SERVICE / {service.number}</span><h1>{service.title}<br/><em>for real work.</em></h1><p>{service.detail}</p><div className="hero-actions"><Link className="button button-dark" to="/contact">Discuss your project <ArrowUpRight size={16}/></Link><a className="text-link" href="mailto:symmetriccode01@gmail.com">Email the team <ArrowUpRight size={15}/></a></div></section><section className="service-content"><div><span className="eyebrow">WHAT WE CAN HELP WITH</span><h2>Useful pieces.<br/>Connected together.</h2></div><div className="service-outcomes">{service.outcomes.map((item,i)=><div key={item}><span>0{i+1}</span><p>{item}</p><Check size={16}/></div>)}</div></section><section className="faq-section service-faq"><div><span className="eyebrow">SERVICE QUESTIONS</span><h2>Clear answers,<br/>before the call.</h2></div><FAQList items={service.faqs}/></section><section className="service-fit"><span className="eyebrow">A GOOD PLACE TO START</span><h2>Bring us the business problem.<br/><em>We’ll help shape the right solution.</em></h2><p>We’ll learn what your team needs, clarify the scope and agree on the next step before development begins. Every project starts with a conversation.</p><Link className="button button-dark" to="/contact">Tell us what you need <ArrowUpRight size={16}/></Link></section><div className="related-services"><span className="eyebrow">MORE FROM OUR TEAM</span>{services.filter(s=>s.id!==service.id).map(s=><Link to={`/services/${s.slug}`} key={s.id}>{s.title}<ArrowUpRight size={15}/></Link>)}</div></main><Footer/><StaticAssistant/></>}

function PricingPage(){const items=[{q:'Why are there no fixed prices on this page?',a:'Each project varies by scope, integrations, content, design needs and delivery constraints. We do not want to publish a number without understanding what you need.'},{q:'How do you prepare a project quote?',a:'We first discuss the goals, users, requirements, existing systems and timeline. Then we can outline deliverables, assumptions, milestones and a project fee for your review.'},{q:'Can a project start with a smaller first phase?',a:'Often, a project can be divided into discovery or a first release followed by later improvements. The right structure depends on the project and will be written into the proposal.'}];return <><SEO title="Project pricing" path="/pricing" description="How Symmetric Code scopes and quotes website, app, POS and automation projects." faqItems={items}/><main className="inner-page"><section className="inner-hero"><span className="eyebrow">PRICING / PROJECT SCOPE</span><h1>Clear scope before<br/><em>we talk numbers.</em></h1><p>Software projects differ in features, integrations and delivery needs. We prepare a project-specific quote after understanding the work—without posting misleading package prices.</p></section><section className="pricing-factors"><div><span className="eyebrow">WHAT SHAPES A QUOTE</span><h2>Understand the work.<br/>Then price it fairly.</h2><p>We discuss the requirements first, then provide the proposed scope and commercial terms in writing for your review.</p></div><div className="service-outcomes">{['Project goals and required features','Number and type of screens or workflows','External systems and integrations','Content, design and data migration needs','Testing, launch and post-launch support'].map((item,i)=><div key={item}><span>0{i+1}</span><p>{item}</p><Check size={16}/></div>)}</div></section><section className="pricing-steps"><span className="eyebrow">A SIMPLE QUOTING PROCESS</span><div className="process-grid">{[['01','Talk','Share the business problem and project context.'],['02','Scope','Agree on deliverables, assumptions and priorities.'],['03','Proposal','Review timeline, fees and payment milestones in writing.']].map(([n,t,d])=><article key={n}><span>{n}</span><div className="process-line"/><h3>{t}</h3><p>{d}</p></article>)}</div></section><section className="faq-section"><div><span className="eyebrow">PRICING QUESTIONS</span><h2>How we quote.</h2></div><FAQList items={items}/></section><ContactBanner/></main><Footer/><StaticAssistant/></>}

function LegalPage(){const {slug}=useParams();const doc=legalDocs.find(item=>item.slug===slug);if(!doc)return <NotFound/>;const hasPlaceholders=doc.sections.some(section=>section[1].includes('{{'))||doc.effectiveDate?.includes('{{');return <><SEO title={doc.title} path={`/legal/${doc.slug}`} description={doc.description} noindex={hasPlaceholders}/><main className="inner-page legal-page"><nav className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13}/><span>Policies</span><ChevronRight size={13}/><span>{doc.title}</span></nav><section className="inner-hero"><span className="eyebrow">LEGAL / {doc.title.toUpperCase()}</span><h1>{doc.title}</h1><p>{doc.description}</p><p className="legal-effective-date">Effective date: {doc.effectiveDate}</p></section>{hasPlaceholders&&<div className="legal-draft-notice"><b>Draft with placeholders</b><p>Replace every <code>{'{{PLACEHOLDER}}'}</code>, confirm your business practices and governing jurisdiction, then have the final wording reviewed before publishing this policy as operative terms.</p></div>}<article className="legal-content">{doc.sections.map(([heading,body])=><section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</article><div className="related-services legal-related"><span className="eyebrow">OTHER POLICY PAGES</span>{legalDocs.filter(item=>item.slug!==doc.slug).map(item=><Link to={`/legal/${item.slug}`} key={item.slug}>{item.title}<ArrowUpRight size={15}/></Link>)}</div></main><Footer/><StaticAssistant/></>}

function WorkPage() { const [filter,setFilter]=useState('All work');const categories=['All work',...new Set(projects.map(p=>p.category))];const visible=filter==='All work'?projects:projects.filter(p=>p.category===filter);return <><SEO title="Selected work" path="/work" description="Browse Symmetric Code websites and digital projects, with live previews and source links."/><main className="inner-page"><section className="inner-hero"><span className="eyebrow">SELECTED WORK / 01—07</span><h1>Digital projects,<br/><em>made for people.</em></h1><p>A selection of websites and digital products from our team. Open a live project or explore the available source code.</p></section><div className="filter-row">{categories.map(c=><button className={filter===c?'active':''} key={c} onClick={()=>setFilter(c)}>{c}</button>)}</div><motion.div className="project-grid work-grid" layout>{visible.map(p=><ProjectCard project={p} key={p.id}/>)}</motion.div><ContactBanner/></main><Footer/><StaticAssistant/></> }

function AboutPage() {const [brandFlipped,setBrandFlipped]=useState(false);const [flippedMember,setFlippedMember]=useState(null);return <><SEO title="About us" path="/about" description="Meet the five-person Symmetric Code team and learn how we work with businesses."/><main className="inner-page"><section className="inner-hero"><span className="eyebrow">ABOUT SYMMETRIC CODE</span><h1>A close-knit team.<br/><em>Built to build.</em></h1><p>We’re a five-person software team, working with business owners to turn real operational needs into useful digital products and open to projects internationally.</p></section><section className="about-note"><div className="about-brand-image"><div className="brand-hanger"><span className="hanger-cord"/><span className="hanger-hook"/><div className="hanging-card-shell"><button type="button" className={`about-logo-card ${brandFlipped?"is-flipped":""}`} onClick={()=>setBrandFlipped(!brandFlipped)} aria-label="Flip the Symmetric Code logo card" aria-pressed={brandFlipped}><span className="about-logo-card-inner"><span className="about-logo-face about-logo-front"><img src="/images/symmetric-code-logo-transparent.png" alt="Symmetric Code logo"/><small>CLICK TO TURN</small></span><span className="about-logo-face about-logo-back"><span className="about-card-monogram">SC</span><b>SYMMETRIC CODE</b><small>DESIGN / BUILD / GROW</small><i>Thoughtful software for businesses.</i></span></span></button></div></div></div><div><span className="eyebrow">OUR POINT OF VIEW</span><h2>Technology earns its place when it makes work clearer.</h2><p>We care about understanding the problem before choosing the tools. That means honest conversations, clear scope, thoughtful design and steady progress you can see.</p></div></section><section className="team-section"><div className="section-heading"><div><span className="eyebrow">THE PEOPLE BEHIND THE WORK</span><h2>Five minds.<br/>One team.</h2></div><p>We bring different strengths together to take a project from its first question to a working product.</p></div><div className="team-grid">{team.map((m,i)=><article className="team-member-card" key={m.name}><span className="team-hanger-cord"/><div className="team-card-shell" style={{"--team-index":i}}><button type="button" className={`team-flip-card ${flippedMember===i?"is-flipped":""}`} onClick={()=>setFlippedMember(flippedMember===i?null:i)} aria-label={`Flip ${m.name} team card`} aria-pressed={flippedMember===i}><span className="team-flip-inner"><span className={`team-card-face team-card-front portrait-${i} ${i===0?"team-photo-front":""}`}>{i===0?<img src="/images/team/aaliyan-profile.jpg" alt="Aaliyan"/>:<span>{m.name.slice(0,1)}</span>}<i>0{i+1}</i></span><span className="team-card-face team-card-back"><span className="team-back-mark">{m.name.slice(0,1)}</span><b>{m.name}</b><small>{i===0?"CEO & Founder":m.focus}</small><span className="team-card-number">TEAM / 0{i+1}</span></span></span></button></div><h3>{m.name}</h3><p>{m.focus}</p>{i===0&&<Link className="team-profile-link" to="/team/aaliyan">View profile <ArrowUpRight size={14}/></Link>}</article>)}</div></section><section className="faq-section"><div><span className="eyebrow">GOOD TO KNOW</span><h2>Questions, answered.</h2></div><FAQList/></section><ContactBanner/></main><Footer/><StaticAssistant/></> }

function FAQList({items=faqs}) {const [active,setActive]=useState(0);return <div className="faq-list">{items.map((f,i)=><article className={active===i?'faq-open':''} key={f.q}><button aria-expanded={active===i} onClick={()=>setActive(active===i?-1:i)}>{f.q}<span>{active===i?<Minus size={18}/>:<Plus size={18}/>}</span></button><AnimatePresence initial={false}>{active===i&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>{f.a}</motion.p>}</AnimatePresence></article>)}</div>}

function ContactBanner(){return <section className="contact-banner"><div><span className="eyebrow">LET’S TALK ABOUT IT</span><h2>Have a problem<br/>we can help solve?</h2></div><Link className="button button-dark" to="/contact">Tell us about it <ArrowUpRight size={16}/></Link></section>}

function ContactPage(){
  const [form,setForm]=useState({name:'',email:'',company:'',service:'',details:'',website:''});
  const [state,setState]=useState('idle');
  const [submitError,setSubmitError]=useState('');
  const [token,setToken]=useState('');
  const [challengeKey,setChallengeKey]=useState(0);
  const [verificationError,setVerificationError]=useState('');
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  const productionReady=emailConfig.enabled&&Boolean(emailConfig.turnstileSiteKey);
  async function submit(e){
    e.preventDefault();
    if(!import.meta.env.DEV&&!productionReady){setState('error');return}
    if(!import.meta.env.DEV&&!token){setVerificationError('Please complete the verification before sending.');return}
    setSubmitError('');
    setState('sending');
    try{
      const base=import.meta.env.VITE_API_URL||(import.meta.env.DEV?'http://localhost:4000':'');
      const payload=import.meta.env.DEV?form:{...form,token,submissionId:crypto.randomUUID()};
      const res=await fetch(`${base}/api/contact`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await res.json();
      if(!res.ok||!result.message){
        const message=res.status===503
          ? 'The email service is not configured in the Cloudflare production environment yet.'
          : res.status===502
            ? 'The email provider rejected the request. Check the Resend sender domain and sender address.'
            : res.status===404
              ? 'The contact API is missing from this Cloudflare deployment. Deploy the latest Pages Functions with the site.'
            : res.status===403
              ? 'Security verification expired or could not be validated. Please try again.'
              : result.error||'The request could not be sent. Please try again.';
        throw new Error(message);
      }
      setState('sent');
      setSubmitError('');
      setForm({name:'',email:'',company:'',service:'',details:'',website:''});
      setToken('');
      setVerificationError('');
      setChallengeKey(key=>key+1);
    }catch(error){
      setState('error');
      setSubmitError(error instanceof TypeError
        ? 'The contact service could not be reached. Please try again in a moment.'
        : error.message||'We could not send your request. Please email us directly.');
      if(!import.meta.env.DEV){setToken('');setChallengeKey(key=>key+1)}
    }
  }
  return <><SEO title="Contact" path="/contact" description="Tell Symmetric Code about your project and arrange a consultation call."/><main className="inner-page contact-page"><section className="contact-layout"><div className="contact-copy"><span className="eyebrow">LET’S START WITH A CONVERSATION</span><h1>What are you<br/><em>working on?</em></h1><p>Tell us a little about your business and what you need. We’ll get back to arrange a call and discuss the next step.</p><div className="contact-direct"><span>EMAIL US DIRECTLY</span><a href="mailto:symmetriccode01@gmail.com">symmetriccode01@gmail.com <ArrowUpRight size={15}/></a></div><div className="contact-direct"><span>CALL US</span><a href="tel:+923083504631">+92 308 3504631 <ArrowUpRight size={15}/></a></div><div className="contact-direct"><span>WHATSAPP</span><a href="https://wa.me/923083504631" target="_blank" rel="noreferrer">Message us on WhatsApp <ArrowUpRight size={15}/></a></div></div><form className="contact-form" onSubmit={submit}>
    <label className="trap-field" aria-hidden="true">Website<input tabIndex="-1" autoComplete="off" name="website" value={form.website} onChange={change}/></label>
    <label>Your name<input required name="name" value={form.name} onChange={change} placeholder="Name"/></label>
    <label>Work email<input required type="email" name="email" value={form.email} onChange={change} placeholder="you@company.com"/></label>
    <label>Company <span className="optional">OPTIONAL</span><input name="company" value={form.company} onChange={change} placeholder="Your company"/></label>
    <label>What do you need?<select name="service" value={form.service} onChange={change}><option value="">Choose a service</option>{['Website or web app','Mobile application','POS or custom software','AI or workflow automation','Not sure yet'].map(s=><option key={s}>{s}</option>)}</select></label>
    <label className="full-field">A little about your project<textarea required name="details" value={form.details} onChange={change} rows="4" placeholder="What are you hoping to build or improve?"/></label>
    {!import.meta.env.DEV&&productionReady&&<div className="contact-verification full-field"><span className="eyebrow">QUICK SECURITY CHECK</span><Turnstile key={challengeKey} siteKey={emailConfig.turnstileSiteKey} onToken={value=>{setToken(value);setVerificationError('')}} onError={setVerificationError}/></div>}
    {!import.meta.env.DEV&&!productionReady&&<p className="form-message error full-field">Online form email is not configured yet. Please email us directly at <a href="mailto:symmetriccode01@gmail.com">symmetriccode01@gmail.com</a>.</p>}
    {verificationError&&<p className="form-message error full-field" role="alert">{verificationError}</p>}
    <button className="button button-dark full-field" disabled={state==='sending'||(!import.meta.env.DEV&&!productionReady)}>{state==='sending'?'Sending…':<>Send consultation request <ArrowUpRight size={16}/></>}</button>
    {state==='sent'&&<p className="form-message success full-field" role="status"><Check size={16}/> Thanks—your consultation request has been emailed to our team. We’ll be in touch.</p>}
    {state==='error'&&(productionReady||import.meta.env.DEV)&&<p className="form-message error full-field" role="alert">{submitError||'We couldn’t send your request just now.'} Please email us at <a href="mailto:symmetriccode01@gmail.com">symmetriccode01@gmail.com</a>.</p>}
    <small className="full-field form-privacy">Your details are used to follow up about this project. Read the <Link to="/legal/privacy">Privacy Policy</Link>.</small>
  </form></section><div className="contact-faq"><span className="eyebrow">BEFORE THE CALL</span><p>We’ll discuss your goals, users, scope, timeline and the best next step. No pressure and no obligation.</p></div></main><Footer/><StaticAssistant/></>;
}
function InsightsPage(){return <><SEO title="Software, Website & Automation Insights" path="/insights" description="Practical guides to business website development, mobile apps, POS software, AI solutions and workflow automation."/><main className="inner-page"><section className="inner-hero"><span className="eyebrow">NOTES FROM THE TEAM</span><h1>Useful thoughts<br/><em>for better work.</em></h1><p>Practical perspectives on websites, apps, business software, AI and automation.</p></section><div className="article-list">{blogPosts.map(post=><Link to={`/insights/${post.slug}`} key={post.slug} className="article-row"><span className="eyebrow">{post.category}　·　{post.readTime}</span><h2>{post.title}</h2><p>{post.excerpt}</p><span className="text-link">Read article <ArrowUpRight size={16}/></span></Link>)}</div><ContactBanner/></main><Footer/><StaticAssistant/></>}

function ArticlePage(){
 const slug=useLocation().pathname.split('/').at(-1);
 const post=blogPosts.find(p=>p.slug===slug);
 if(!post)return <NotFound/>;
 const content=post.sections
  ? post.sections.map((section,index)=><section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph,pIndex)=><p key={`${index}-${pIndex}`}>{paragraph}</p>)}</section>)
  : post.body.map((paragraph,index)=><p key={index}>{paragraph}</p>);
 return <><SEO title={post.title} path={`/insights/${post.slug}`} description={post.excerpt} articleData={{title:post.title,description:post.excerpt,date:post.date}}/><main className="inner-page article-page"><Link className="back-link" to="/insights"><ChevronRight size={15}/> All insights</Link><article><span className="eyebrow">{post.category}　·　{post.date}　·　{post.readTime}</span><h1>{post.title}</h1><p className="article-excerpt">{post.excerpt}</p><div className="article-rule"/>{content}<div className="article-end"><span>Want to discuss a project?</span><div>{post.relatedService&&<Link className="text-link" to={`/services/${post.relatedService}`}>Explore this service <ArrowUpRight size={16}/></Link>}<Link className="text-link" to="/contact">Talk to our team <ArrowUpRight size={16}/></Link></div></div></article></main><Footer/><StaticAssistant/></>}

function getAssistantAnswer(input){const q=input.toLowerCase();if(/price|pricing|cost|budget|quote|fee/.test(q))return 'Project pricing is custom. We first discuss scope, features, integrations and timeline, then send a written proposal with the project fee and payment milestones.';if(/portfolio|project|live site|demo|github|source code|work examples/.test(q))return 'The Work page contains seven selected projects, from the Client Requirement portal through the Gym website. Each card links to its live version, and to GitHub where a source link was provided.';if(/blog|article|insight|post/.test(q))return 'The Insights page has practical guides to business websites, mobile apps, POS software, AI solutions, workflow automation and custom software.';if(/terms|privacy|cookie|agreement|legal/.test(q))return 'The footer includes the Website Terms, Privacy Policy, Cookie & Tracking Notice, Website Disclaimer and Project Terms Overview. Project-specific scope and commercial terms are set out in each signed proposal or statement of work.';if(/industry|industries|clinic|real estate|construction|home service|retail|business|who do you work/.test(q))return faqs[1].a;if(/service|build|develop|website|web app|mobile|app|pos|software|automat|ai/.test(q))return faqs[0].a;if(/process|start|begin|how.*work|timeline|steps/.test(q))return faqs[2].a;if(/call|contact|email|phone|whatsapp|book|talk|reach/.test(q))return faqs[3].a;if(/team|member|people|company|symmetric|who are/.test(q))return faqs[4].a;return 'I don’t have that detail in my website FAQs yet. Send us a message at symmetriccode01@gmail.com or request a call, and our team can help.'}
function StaticAssistant(){const [open,setOpen]=useState(false);const [query,setQuery]=useState('');const [answer,setAnswer]=useState('');const suggestions=['What services do you offer?','Who do you work with?','How can I book a call?'];function ask(text){setQuery(text);setAnswer(getAssistantAnswer(text))}function submit(e){e.preventDefault();if(query.trim())ask(query)}return <div className="assistant-wrap"><AnimatePresence>{open&&<motion.div className="assistant-panel" initial={{opacity:0,y:15,scale:.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:15}}><header><div><span className="assistant-live"/> Symmetric Code assistant</div><button onClick={()=>setOpen(false)} aria-label="Close assistant"><X size={17}/></button></header><div className="assistant-messages"><div className="assistant-bubble">Hi! I can answer questions about Symmetric Code, our services, industries, projects, pricing approach and policies.</div>{answer&&<><div className="user-bubble">{query}</div><div className="assistant-bubble">{answer}</div></>}<div className="assistant-suggestions">{suggestions.map(s=><button key={s} onClick={()=>ask(s)}>{s}<ArrowUpRight size={13}/></button>)}</div></div><form onSubmit={submit}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask about our website…" maxLength={300} aria-label="Ask a question about Symmetric Code"/><button aria-label="Send question"><Send size={16}/></button></form><small>Answers use information published on this website.</small></motion.div>}</AnimatePresence><button className="assistant-launch" onClick={()=>setOpen(!open)} aria-label="Open website FAQ assistant">{open?<X size={22}/>:<MessageCircle size={22}/>}<span>Ask us</span></button></div>}

function TeamProfilePage(){return <><SEO title="Aaliyan — CEO & Founder" path="/team/aaliyan" description="Meet Aaliyan, CEO and Founder of Symmetric Code and Backend Developer."/><main className="inner-page team-profile-page"><nav className="breadcrumbs"><Link to="/">Home</Link><ChevronRight size={13}/><Link to="/about">About</Link><ChevronRight size={13}/><span>Aaliyan</span></nav><section className="service-hero profile-hero"><span className="eyebrow">TEAM PROFILE / 01</span><h1>AALIYAN</h1><p>CEO & Founder at Symmetric Code, focused on backend development and building reliable foundations for business software.</p><div className="profile-facts"><div><span>POSITION</span><strong>CEO & Founder</strong></div><div><span>ROLE</span><strong>Backend Developer</strong></div><div><span>QUALIFICATION</span><strong>Software Engineer</strong></div></div><a className="button button-dark" href="https://www.aaliyankhan.me" target="_blank" rel="noreferrer">Visit portfolio <ArrowUpRight size={16}/></a></section></main><Footer/><StaticAssistant/></>}

function NotFound(){return <><SEO title="Page not found"/><main className="inner-page not-found"><span className="eyebrow">404 / PAGE NOT FOUND</span><h1>Looks like this<br/><em>page moved.</em></h1><Link className="button button-dark" to="/">Back to home <ArrowRight size={16}/></Link></main><Footer/></>}

function PageMotionEffects({route,active}){useEffect(()=>{if(active)return;const parts=route.split('/').filter(Boolean);let kind='home';if(parts[0]==='services')kind=parts[1]?`service-${parts[1]}`:'services';else if(parts[0]==='solutions')kind=parts[1]?`industry-${parts[1]}`:'industries';else if(parts[0]==='work')kind='work';else if(parts[0]==='pricing')kind='pricing';else if(parts[0]==='about')kind='about';else if(parts[0]==='team')kind='team';else if(parts[0]==='contact')kind='contact';else if(parts[0]==='insights')kind=parts[1]?'article':'insights';else if(parts[0]==='legal')kind='legal';const hero=document.querySelector('#main-content .inner-hero, #main-content .service-hero, #main-content .contact-copy, #main-content .article-page article, #main-content .not-found');if(hero)hero.dataset.heroMotion=kind;const items=document.querySelectorAll('#main-content main > section, #main-content main > .inner-hero, #main-content main .project-card, #main-content main .solution-card, #main-content main .article-row');if(!('IntersectionObserver'in window)){items.forEach(item=>item.classList.add('reveal-visible'));return}const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal-visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});items.forEach((item,index)=>{item.classList.add('scroll-reveal');item.style.setProperty('--reveal-delay',`${Math.min(index%4,3)*70}ms`);observer.observe(item)});return()=>observer.disconnect()},[route,active]);return null}
export default function App({initialIntroActive=true}={}){const location=useLocation();const [introActive,setIntroActive]=useState(initialIntroActive);useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){setIntroActive(false);return}setIntroActive(true);const timer=window.setTimeout(()=>setIntroActive(false),900);return()=>window.clearTimeout(timer)},[]);useEffect(()=>{window.scrollTo(0,0)},[location.pathname]);return <MotionConfig reducedMotion="user"><LayoutGroup id="brand-intro"><a className="skip-link" href="#main-content">Skip to content</a><Header introActive={introActive}/><AnimatePresence mode="wait"><motion.div id="main-content" key={location.pathname} initial={false} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.18}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/services" element={<ServicesPage/>}/><Route path="/services/:slug" element={<ServicePage/>}/><Route path="/solutions" element={<SolutionsHub/>}/><Route path="/solutions/:slug" element={<SolutionPage/>}/><Route path="/work" element={<WorkPage/>}/><Route path="/pricing" element={<PricingPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/team/aaliyan" element={<TeamProfilePage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/insights" element={<InsightsPage/>}/><Route path="/insights/:slug" element={<ArticlePage/>}/><Route path="/legal/:slug" element={<LegalPage/>}/><Route path="*" element={<NotFound/>}/></Routes><PageMotionEffects route={location.pathname} active={introActive}/></motion.div></AnimatePresence><AnimatePresence>{introActive&&<LoadingIntro key="site-intro"/>}</AnimatePresence></LayoutGroup></MotionConfig>}
