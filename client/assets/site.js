/**
 * EL-ALEM ARTIST WEBSITE - CORE LOGIC
 * Handles data simulation (mock backend), rendering, and interactions.
 */

const SEED_DATA = {
    works: [
        { id: 'w1', title: 'Stille im Sturm', category: 'Gemälde', serie: 's1', year: 2024, technique: 'Öl auf Leinwand', size: '100x100 cm', price: '2.400 €', image: '/uploads/abstract_oil_paintin_51924054.jpg', visible: true, featured: true },
        { id: 'w2', title: 'Rote Dämmerung', category: 'Gemälde', serie: 's1', year: 2024, technique: 'Öl auf Leinwand', size: '80x100 cm', price: '1.800 €', image: '/uploads/abstract_oil_paintin_69132eda.jpg', visible: true, featured: true },
        { id: 'w3', title: 'Struktur I', category: 'Gemälde', serie: 's1', year: 2023, technique: 'Mischtechnik', size: '50x50 cm', price: '900 €', image: '/uploads/abstract_oil_paintin_ef97bc95.jpg', visible: true, featured: false },
        { id: 'w4', title: 'Struktur II', category: 'Gemälde', serie: 's1', year: 2023, technique: 'Mischtechnik', size: '50x50 cm', price: '900 €', image: '/uploads/abstract_oil_paintin_52381cd3.jpg', visible: true, featured: false },
        
        { id: 'w5', title: 'Neon Pulse', category: 'Lichtkunst', serie: 's2', year: 2025, technique: 'LED & Acryl', size: 'Installation', price: 'Auf Anfrage', image: '/uploads/light_art_installati_14dd2f58.jpg', visible: true, featured: true },
        { id: 'w6', title: 'Blue Void', category: 'Lichtkunst', serie: 's2', year: 2025, technique: 'Neonröhren', size: '120x40 cm', price: '3.200 €', image: '/uploads/light_art_installati_db6f5f2c.jpg', visible: true, featured: true },
        { id: 'w7', title: 'Red Line', category: 'Lichtkunst', serie: 's2', year: 2024, technique: 'Lichtinstallation', size: 'Variabel', price: 'Auf Anfrage', image: '/uploads/light_art_installati_3c03dd6c.jpg', visible: true, featured: false },
        { id: 'w8', title: 'Dark Matter', category: 'Lichtkunst', serie: 's2', year: 2024, technique: 'LED & Stahl', size: '200x200 cm', price: '5.500 €', image: '/uploads/light_art_installati_96b1d626.jpg', visible: true, featured: false },
    ],
    series: [
        { id: 's1', title: 'Echo der Stille', category: 'Gemälde', year: '2023-2024', technique: 'Öl & Mischtechnik', count: 4, visible: true, description: 'Eine Auseinandersetzung mit der Ruhe im Chaos der modernen Welt.' },
        { id: 's2', title: 'Luminous Dreams', category: 'Lichtkunst', year: '2024-2025', technique: 'Licht & Raum', count: 4, visible: true, description: 'Licht als skulpturales Element, das den Raum neu definiert.' }
    ],
    catalogues: [
        { id: 'c1', title: 'Re-Integration', image: '/uploads/art_catalogue_book_c_697661d0.jpg', visible: true, pdf: '/uploads/re-integration.pdf' },
        { id: 'c2', title: 'Gedichte 2016', image: '/uploads/art_catalogue_book_c_da631099.jpg', visible: true, pdf: '/uploads/poem.pdf' }
    ],
    artist: {
        portrait: '/uploads/older_male_artist_po_bd6859aa.jpg',
        bio: 'El-Âlem sucht nicht das Abbild, sondern das Urbild. In seinen Werken verschwimmen die Grenzen zwischen Malerei und Skulptur, zwischen Licht und Dunkelheit.'
    },
    requests: [],
    comments: []
};

// --- DATA STORE (Mock Backend) ---
const DB = {
    init: () => {
        if (!localStorage.getItem('el_alem_data')) {
            console.log('🌱 Seeding Database...');
            localStorage.setItem('el_alem_data', JSON.stringify(SEED_DATA));
        }
    },
    get: () => JSON.parse(localStorage.getItem('el_alem_data')),
    set: (data) => localStorage.setItem('el_alem_data', JSON.stringify(data)),
    
    // Helpers
    getWorks: () => DB.get().works.filter(w => w.visible),
    getSeries: () => DB.get().series.filter(s => s.visible),
    getCatalogues: () => DB.get().catalogues.filter(c => c.visible),
    addRequest: (req) => {
        const data = DB.get();
        req.id = 'req_' + Date.now();
        req.date = new Date().toISOString();
        req.status = 'Neu';
        data.requests.unshift(req);
        DB.set(data);
        console.log('📧 E-Mail Simulation: An admin@kunst-el-alem.de gesendet:', req);
    },
    
    // Specific Getters
    getWorkById: (id) => DB.get().works.find(w => w.id === id),
    getSerieById: (id) => DB.get().series.find(s => s.id === id),
    getWorksBySerie: (serieId) => DB.get().works.filter(w => w.serie === serieId && w.visible)
};

// --- UI RENDERERS ---

const UI = {
    init: () => {
        DB.init();
        UI.setupNavigation();
        
        // Page specific inits
        if (document.getElementById('hero-slideshow')) UI.renderHero();
        if (document.getElementById('new-works-grid')) UI.renderNewWorks();
        if (document.getElementById('spotlight-1')) UI.renderSpotlight('s1', 'spotlight-1');
        if (document.getElementById('spotlight-2')) UI.renderSpotlight('s2', 'spotlight-2');
        if (document.getElementById('catalogues-grid')) UI.renderCatalogues();
        if (document.getElementById('contact-form')) UI.setupContactForm();

        // Subpages
        if (document.getElementById('all-works-grid')) UI.renderAllWorks();
        if (document.getElementById('serie-detail')) UI.renderSerieDetail();
        if (document.getElementById('werk-detail')) UI.renderWerkDetail();
        
        // Signature injection in footer if exists
        const footerSig = document.getElementById('footer-signature');
        if(footerSig) footerSig.src = '/assets/signature.png';
    },

    setupNavigation: () => {
        const nav = document.querySelector('nav');
        if(!nav) return;
        
        const updateNav = () => {
            if (window.scrollY > 50) {
                nav.classList.add('nav-scrolled');
                nav.classList.remove('py-6', 'text-white', 'mix-blend-difference');
                nav.classList.add('text-black');
            } else {
                nav.classList.remove('nav-scrolled', 'text-black');
                nav.classList.add('py-6', 'text-white', 'mix-blend-difference');
            }
        };

        window.addEventListener('scroll', updateNav);
        // Init state check
        if(window.scrollY > 50) updateNav();
    },

    renderHero: () => {
        const works = DB.getWorks().filter(w => w.featured).slice(0, 5);
        const container = document.getElementById('hero-slideshow');
        
        // Hero HTML Structure with controls
        let slidesHtml = works.map((w, i) => `
            <div class="slide absolute inset-0 transition-opacity duration-1000 ${i === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}" data-index="${i}">
                <div class="absolute inset-0 bg-black/30 z-10"></div>
                ${w.video 
                  ? `<video src="${w.video}" class="w-full h-full object-cover" autoplay muted loop playsinline></video>`
                  : `<img src="${w.image}" class="w-full h-full object-cover animate-slow-zoom" alt="${w.title}">`
                }
                <div class="absolute bottom-24 left-6 md:left-24 z-20 text-white max-w-xl pointer-events-none">
                    <p class="text-sm md:text-base tracking-widest uppercase mb-2 font-light opacity-90">${w.category} | ${w.year}</p>
                    <h2 class="text-4xl md:text-6xl font-serif font-light mb-4 leading-tight">${w.title}</h2>
                    <a href="werk.html?id=${w.id}" class="inline-block border border-white/50 hover:bg-white hover:text-black px-6 py-2 transition-all duration-300 text-sm tracking-wider pointer-events-auto">WERK ANSEHEN</a>
                </div>
            </div>
        `).join('');

        // Controls
        const controlsHtml = `
            <div class="absolute bottom-8 right-8 z-30 flex items-center space-x-6 text-white">
                 <button id="hero-pause" class="hover:text-gray-300 transition-colors">
                    <i class="ph ph-pause text-2xl" id="pause-icon"></i>
                </button>
                <button id="hero-next" class="group flex items-center space-x-2 text-sm tracking-widest hover:text-gray-300 transition-colors">
                    <span>NÄCHSTES WERK</span>
                    <i class="ph ph-arrow-right text-xl group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        `;
        
        container.innerHTML = slidesHtml + controlsHtml;

        // Logic
        let current = 0;
        let playing = true;
        const slides = container.querySelectorAll('.slide');
        let interval;

        const nextSlide = () => {
            slides[current].classList.remove('opacity-100', 'z-10');
            slides[current].classList.add('opacity-0', 'z-0');
            
            current = (current + 1) % slides.length;
            
            slides[current].classList.remove('opacity-0', 'z-0');
            slides[current].classList.add('opacity-100', 'z-10');
        };

        const startInterval = () => {
            interval = setInterval(nextSlide, 5000);
        };

        startInterval();

        // Listeners
        document.getElementById('hero-next').addEventListener('click', () => {
            clearInterval(interval);
            nextSlide();
            if(playing) startInterval();
        });

        document.getElementById('hero-pause').addEventListener('click', () => {
            playing = !playing;
            const icon = document.getElementById('pause-icon');
            if (playing) {
                icon.classList.remove('ph-play');
                icon.classList.add('ph-pause');
                startInterval();
            } else {
                icon.classList.remove('ph-pause');
                icon.classList.add('ph-play');
                clearInterval(interval);
            }
        });
    },

    renderNewWorks: () => {
        const works = DB.getWorks().slice(0, 4);
        const container = document.getElementById('new-works-grid');
        container.innerHTML = works.map(w => UI.createWorkCard(w)).join('');
    },

    createWorkCard: (w) => `
        <a href="werk.html?id=${w.id}" class="group block relative aspect-[4/5] overflow-hidden bg-gray-100">
            <img src="${w.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="${w.title}">
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 text-white">
                <h3 class="font-serif text-xl">${w.title}</h3>
                <p class="text-xs tracking-wider mt-1">${w.technique}</p>
            </div>
        </a>
    `,

    renderSpotlight: (serieId, containerId) => {
        const series = DB.getSeries().find(s => s.id === serieId);
        const works = DB.getWorks().filter(w => w.serie === serieId);
        if (!series || works.length === 0) return;
        const mainWork = works[0];
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div class="relative aspect-square md:aspect-[4/3] overflow-hidden group">
                    <img src="${mainWork.image}" class="w-full h-full object-cover" alt="${series.title}">
                </div>
                <div class="flex flex-col justify-center space-y-6">
                    <span class="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Spotlight Serie</span>
                    <h2 class="text-4xl md:text-5xl font-serif text-gray-900">${series.title}</h2>
                    <div class="w-12 h-1 bg-black"></div>
                    <p class="text-gray-600 leading-relaxed max-w-md">${series.description}</p>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-500 pt-4">
                        <div><span class="block text-xs uppercase tracking-wider text-gray-400">Technik</span>${series.technique}</div>
                        <div><span class="block text-xs uppercase tracking-wider text-gray-400">Jahr</span>${series.year}</div>
                    </div>
                    <div class="pt-6">
                        <a href="serie.html?id=${series.id}" class="inline-flex items-center text-sm font-semibold tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-400 transition-colors">
                            GANZE SERIE ANSEHEN (${series.count} WERKE)
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    renderCatalogues: () => {
        const catalogues = DB.getCatalogues();
        const container = document.getElementById('catalogues-grid');
        container.innerHTML = catalogues.map(c => `
            <div class="group cursor-pointer">
                <div class="relative aspect-[3/4] bg-gray-100 mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <img src="${c.image}" class="w-full h-full object-cover" alt="${c.title}">
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-white/20 transition-colors flex items-center justify-center">
                         <span class="opacity-0 group-hover:opacity-100 bg-white text-black px-4 py-2 text-xs tracking-widest shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">BLÄTTERN</span>
                    </div>
                </div>
                <h3 class="text-lg font-serif text-center">${c.title}</h3>
                <div class="text-center mt-2">
                    <a href="${c.pdf}" target="_blank" class="text-xs uppercase tracking-widest text-gray-400 hover:text-black">Download PDF</a>
                </div>
            </div>
        `).join('');
    },

    setupContactForm: () => {
        const form = document.getElementById('contact-form');
        if(!form) return;
        
        // Check for URL params to prefill
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject');
        if(subject) {
            form.querySelector('textarea').value = `Ich interessiere mich für: ${subject}\n\n`;
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            if (data.website) { console.warn('Bot detected via honeypot'); return; }
            DB.addRequest({ name: data.name, email: data.email, message: data.message, reason: data.reason });
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Vielen Dank!';
            btn.classList.add('bg-green-600', 'border-green-600', 'text-white');
            form.reset();
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('bg-green-600', 'border-green-600', 'text-white');
            }, 3000);
        });
    },

    // --- NEW RENDERERS ---

    renderAllWorks: () => {
        const works = DB.getWorks();
        const container = document.getElementById('all-works-grid');
        
        // If works are empty, show something? 
        // We will default render all
        
        const render = (items) => {
             container.innerHTML = items.map(w => UI.createWorkCard(w)).join('');
        };
        
        render(works);
        
        // Subcategories / Series Filter
        const series = DB.getSeries();
        const subNav = document.getElementById('series-subnav');
        if(subNav) {
             // Create subnav for series if needed. User asked for "Gemälde haben eigene Serien".
             // We can render list of series buttons dynamically based on selected category filter
        }

        // Main Filter Logic
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Active State
                buttons.forEach(b => b.classList.remove('text-black', 'border-black'));
                buttons.forEach(b => b.classList.add('text-gray-400', 'border-transparent'));
                btn.classList.add('text-black', 'border-black');
                btn.classList.remove('text-gray-400', 'border-transparent');
                
                const filter = btn.dataset.filter;
                let filteredWorks = filter === 'all' ? works : works.filter(w => w.category === filter);
                render(filteredWorks);
            });
        });
    },

    renderSerieDetail: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const serie = DB.getSerieById(id);
        const works = DB.getWorksBySerie(id);
        
        if (!serie) {
            document.getElementById('serie-detail').innerHTML = '<p class="text-center py-20">Serie nicht gefunden.</p>';
            return;
        }

        // Render Header
        document.getElementById('serie-title').innerText = serie.title;
        document.getElementById('serie-meta').innerText = `${serie.technique} | ${serie.year} | ${works.length} Werke`;
        document.getElementById('serie-desc').innerText = serie.description;

        // Render Works Grid
        const grid = document.getElementById('serie-works-grid');
        grid.innerHTML = works.map(w => UI.createWorkCard(w)).join('');
    },

    renderWerkDetail: () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const work = DB.getWorkById(id);
        
        if (!work) {
            document.getElementById('werk-detail').innerHTML = '<p class="text-center py-20">Werk nicht gefunden.</p>';
            return;
        }

        // Render Detail
        if(work.video) {
             document.getElementById('werk-image-container').innerHTML = `
                <video src="${work.video}" controls class="w-full h-auto max-h-[85vh] mx-auto shadow-sm"></video>
             `;
        } else {
             document.getElementById('werk-image').src = work.image;
        }
        
        document.getElementById('werk-title').innerText = work.title;
        document.getElementById('werk-meta').innerHTML = `
            <div class="space-y-2 text-sm text-gray-500">
                <p><strong class="uppercase text-xs tracking-widest text-black block mb-1">Serie</strong> ${DB.getSerieById(work.serie)?.title || '-'}</p>
                <p><strong class="uppercase text-xs tracking-widest text-black block mb-1">Jahr</strong> ${work.year}</p>
                <p><strong class="uppercase text-xs tracking-widest text-black block mb-1">Technik</strong> ${work.technique}</p>
                <p><strong class="uppercase text-xs tracking-widest text-black block mb-1">Maße</strong> ${work.size}</p>
                <p><strong class="uppercase text-xs tracking-widest text-black block mb-1">Preis</strong> ${work.price}</p>
            </div>
        `;
        
        // Setup Inquiry Button
        const inquiryBtn = document.getElementById('inquiry-btn');
        inquiryBtn.href = `/index.html?subject=${encodeURIComponent(work.title)}#contact`;
    }
};

document.addEventListener('DOMContentLoaded', UI.init);
