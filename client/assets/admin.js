/**
 * ADMIN PANEL LOGIC
 * Handles authentication, CRUD operations, and dashboard rendering.
 */

const ADMIN = {
    init: () => {
        // Check Auth
        if (!sessionStorage.getItem('el_alem_admin') && !window.location.href.includes('login.html')) {
            window.location.href = '/admin/login.html';
            return;
        }

        if (window.location.href.includes('login.html')) {
            ADMIN.setupLogin();
            return;
        }

        // Dashboard Init
        ADMIN.renderSidebar();
        ADMIN.renderDashboard();
    },

    setupLogin: () => {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.email.value;
            const password = form.password.value;

            // Mock Creds check
            if (email === 'admin@kunst.de' && password === 'admin') {
                sessionStorage.setItem('el_alem_admin', 'true');
                window.location.href = '/admin/dashboard.html';
            } else {
                alert('Falsche Zugangsdaten! (Try: admin@kunst.de / admin)');
            }
        });
    },

    renderSidebar: () => {
        // Just highlights active link
        const currentHash = window.location.hash || '#dashboard';
        document.querySelectorAll('aside a').forEach(a => {
            if (a.getAttribute('href') === currentHash) {
                a.classList.add('bg-white/10', 'text-white');
                a.classList.remove('text-gray-400');
            } else {
                a.classList.remove('bg-white/10', 'text-white');
                a.classList.add('text-gray-400');
            }
        });
    },

    renderDashboard: () => {
        const view = window.location.hash || '#dashboard';
        const content = document.getElementById('content');
        const db = JSON.parse(localStorage.getItem('el_alem_data'));

        if (view === '#dashboard') {
            content.innerHTML = `
                <h1 class="text-3xl font-serif mb-8">Dashboard</h1>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="bg-white p-6 shadow-sm border border-gray-100">
                        <div class="text-xs uppercase tracking-widest text-gray-400 mb-2">Werke</div>
                        <div class="text-4xl font-serif">${db.works.length}</div>
                    </div>
                    <div class="bg-white p-6 shadow-sm border border-gray-100">
                        <div class="text-xs uppercase tracking-widest text-gray-400 mb-2">Serien</div>
                        <div class="text-4xl font-serif">${db.series.length}</div>
                    </div>
                    <div class="bg-white p-6 shadow-sm border border-gray-100">
                        <div class="text-xs uppercase tracking-widest text-gray-400 mb-2">Anfragen</div>
                        <div class="text-4xl font-serif text-blue-600">${db.requests.filter(r => r.status === 'Neu').length}</div>
                    </div>
                    <div class="bg-white p-6 shadow-sm border border-gray-100">
                        <div class="text-xs uppercase tracking-widest text-gray-400 mb-2">Kataloge</div>
                        <div class="text-4xl font-serif">${db.catalogues.length}</div>
                    </div>
                </div>

                <div class="mt-12">
                    <h2 class="text-xl font-serif mb-6">Neueste Anfragen</h2>
                    <div class="bg-white border border-gray-100 overflow-hidden">
                        <table class="w-full text-left text-sm">
                            <thead class="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                                <tr>
                                    <th class="p-4">Datum</th>
                                    <th class="p-4">Name</th>
                                    <th class="p-4">Grund</th>
                                    <th class="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                ${db.requests.slice(0, 5).map(r => `
                                    <tr>
                                        <td class="p-4 text-gray-400">${new Date(r.date).toLocaleDateString()}</td>
                                        <td class="p-4 font-medium">${r.name}</td>
                                        <td class="p-4">${r.reason}</td>
                                        <td class="p-4"><span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">${r.status}</span></td>
                                    </tr>
                                `).join('')}
                                ${db.requests.length === 0 ? '<tr><td colspan="4" class="p-8 text-center text-gray-400">Keine Anfragen vorhanden.</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (view === '#works') {
            ADMIN.renderWorksList(content, db);
        } else if (view === '#series') {
            ADMIN.renderSeriesList(content, db);
        } else if (view === '#texts') {
            ADMIN.renderTextsList(content, db);
        } else if (view === '#requests') {
            ADMIN.renderRequestsList(content, db);
        } else if (view === '#comments') {
            ADMIN.renderCommentsList(content, db);
        }
    },

    renderWorksList: (container, db) => {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-serif">Werke verwalten</h1>
                <button onclick="ADMIN.openWorkModal()" class="bg-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800">Neues Werk</button>
            </div>
            <div class="bg-white border border-gray-100 overflow-hidden">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                        <tr>
                            <th class="p-4 w-16">Bild</th>
                            <th class="p-4">Titel</th>
                            <th class="p-4">Kategorie</th>
                            <th class="p-4">Serie</th>
                            <th class="p-4">Status</th>
                            <th class="p-4 text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${db.works.map(w => {
                            const serie = db.series.find(s => s.id === w.serie);
                            const serieTitle = serie ? serie.title : '<span class="text-gray-400">-</span>';
                            return `
                            <tr>
                                <td class="p-4"><img src="${w.image}" class="w-10 h-10 object-cover bg-gray-100"></td>
                                <td class="p-4 font-medium">${w.title}</td>
                                <td class="p-4 text-gray-500">${w.category}</td>
                                <td class="p-4 text-gray-500">${serieTitle}</td>
                                <td class="p-4">
                                    <button onclick="ADMIN.toggleVisibility('works', '${w.id}')" class="px-2 py-1 text-xs rounded-full ${w.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}">
                                        ${w.visible ? 'Sichtbar' : 'Versteckt'}
                                    </button>
                                </td>
                                <td class="p-4 text-right space-x-2">
                                    <button onclick="ADMIN.openWorkModal('${w.id}')" class="text-blue-600 hover:underline">Bearbeiten</button>
                                    <button onclick="ADMIN.deleteItem('works', '${w.id}')" class="text-red-600 hover:underline">Löschen</button>
                                </td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderSeriesList: (container, db) => {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-serif">Serien verwalten</h1>
                <button onclick="ADMIN.openSerieModal()" class="bg-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800">Neue Serie</button>
            </div>
            <div class="bg-white border border-gray-100 overflow-hidden">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                        <tr>
                            <th class="p-4">Titel</th>
                            <th class="p-4">Kategorie</th>
                            <th class="p-4">Jahr</th>
                            <th class="p-4">Werke Anzahl</th>
                            <th class="p-4">Status</th>
                            <th class="p-4 text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${db.series.map(s => `
                            <tr>
                                <td class="p-4 font-medium">${s.title}</td>
                                <td class="p-4 text-gray-500">${s.category}</td>
                                <td class="p-4 text-gray-500">${s.year}</td>
                                <td class="p-4 text-gray-500">${s.count}</td>
                                <td class="p-4">
                                    <button onclick="ADMIN.toggleVisibility('series', '${s.id}')" class="px-2 py-1 text-xs rounded-full ${s.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}">
                                        ${s.visible ? 'Sichtbar' : 'Versteckt'}
                                    </button>
                                </td>
                                <td class="p-4 text-right space-x-2">
                                    <button onclick="ADMIN.openSerieModal('${s.id}')" class="text-blue-600 hover:underline">Bearbeiten</button>
                                    ${s.id !== 'none' ? `<button onclick="ADMIN.deleteItem('series', '${s.id}')" class="text-red-600 hover:underline">Löschen</button>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderRequestsList: (container, db) => {
        container.innerHTML = `
             <h1 class="text-3xl font-serif mb-8">Anfragen</h1>
             <div class="space-y-4">
                ${db.requests.map(r => `
                    <div class="bg-white p-6 border border-gray-100 shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-lg">${r.name} <span class="text-gray-400 font-normal text-sm">(${r.email})</span></h3>
                                <div class="text-xs text-gray-400 uppercase mt-1">${r.reason} • ${new Date(r.date).toLocaleString()}</div>
                            </div>
                            <select onchange="ADMIN.updateRequestStatus('${r.id}', this.value)" class="text-xs border p-1 rounded">
                                <option value="Neu" ${r.status === 'Neu' ? 'selected' : ''}>Neu</option>
                                <option value="Beantwortet" ${r.status === 'Beantwortet' ? 'selected' : ''}>Beantwortet</option>
                                <option value="Erledigt" ${r.status === 'Erledigt' ? 'selected' : ''}>Erledigt</option>
                            </select>
                        </div>
                        <p class="text-gray-700 bg-gray-50 p-4 rounded text-sm">${r.message}</p>
                    </div>
                `).join('')}
                ${db.requests.length === 0 ? '<p class="text-gray-500">Keine Anfragen.</p>' : ''}
             </div>
        `;
    },

    renderCommentsList: (container, db) => {
        container.innerHTML = `
             <h1 class="text-3xl font-serif mb-8">Kommentare</h1>
             <div class="space-y-4">
                ${(db.comments || []).map(c => {
                    const work = db.works.find(w => w.id === c.targetId) || db.catalogues.find(cat => cat.id === c.targetId);
                    const workTitle = work ? work.title : 'Unbekanntes Werk';
                    const targetType = db.works.find(w => w.id === c.targetId) ? 'Werk' : 'Katalog';
                    
                    return `
                    <div class="bg-white p-6 border border-gray-100 shadow-sm relative group">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-bold text-lg">${c.name}</h3>
                                <div class="text-xs text-gray-400 uppercase mt-1">Zu: <span class="text-black font-medium">${workTitle}</span> (${targetType}) • ${new Date(c.date).toLocaleString()}</div>
                            </div>
                            <button onclick="ADMIN.deleteComment('${c.id}')" class="text-red-500 hover:text-red-700 text-xs uppercase tracking-widest border border-red-200 px-3 py-1 hover:bg-red-50 transition-colors">Löschen</button>
                        </div>
                        <p class="text-gray-700 bg-gray-50 p-4 rounded text-sm mt-3">${c.message}</p>
                    </div>
                `}).join('')}
                ${(!db.comments || db.comments.length === 0) ? '<p class="text-gray-500">Keine Kommentare vorhanden.</p>' : ''}
             </div>
        `;
    },

    renderTextsList: (container, db) => {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-serif">Texte & Kataloge verwalten</h1>
                <button onclick="alert('Mock: Upload Dialog')" class="bg-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800">PDF Hochladen</button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Catalogues Section -->
                <div>
                    <h3 class="text-xl font-serif mb-4 border-b border-gray-200 pb-2">Kataloge (PDF)</h3>
                    <div class="bg-white border border-gray-100 overflow-hidden">
                        <table class="w-full text-left text-sm">
                            <tbody class="divide-y divide-gray-100">
                                ${db.catalogues.map(c => `
                                    <tr>
                                        <td class="p-4 w-16"><img src="${c.image}" class="w-10 h-12 object-cover bg-gray-100"></td>
                                        <td class="p-4 font-medium">
                                            ${c.title}
                                            <a href="${c.pdf}" target="_blank" class="block text-xs text-blue-600 hover:underline mt-1">PDF ansehen</a>
                                        </td>
                                        <td class="p-4 text-right">
                                            <button onclick="ADMIN.deleteItem('catalogues', '${c.id}')" class="text-red-600 hover:underline text-xs">Löschen</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Texte/Books Section (from Works category 'Texte') -->
                <div>
                    <h3 class="text-xl font-serif mb-4 border-b border-gray-200 pb-2">Texte (Als Werk)</h3>
                    <div class="bg-white border border-gray-100 overflow-hidden">
                        <table class="w-full text-left text-sm">
                            <tbody class="divide-y divide-gray-100">
                                ${db.works.filter(w => w.category === 'Texte').map(w => `
                                    <tr>
                                        <td class="p-4 w-16"><div class="w-10 h-10 bg-gray-50 flex items-center justify-center"><i class="ph ph-article text-xl text-gray-400"></i></div></td>
                                        <td class="p-4 font-medium">
                                            ${w.title}
                                            <span class="block text-xs text-gray-400">${w.technique}</span>
                                        </td>
                                        <td class="p-4 text-right">
                                            ${w.pdf ? `<a href="${w.pdf}" target="_blank" class="text-blue-600 hover:underline text-xs mr-2">PDF</a>` : ''}
                                            <button onclick="ADMIN.openWorkModal('${w.id}')" class="text-blue-600 hover:underline text-xs">Edit</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="mt-12 bg-gray-100 p-8 rounded border border-gray-200 text-center">
                <i class="ph ph-file-pdf text-4xl text-gray-400 mb-4"></i>
                <h3 class="text-lg font-bold text-gray-600">PDF Vorschau Integration</h3>
                <p class="text-sm text-gray-500 max-w-md mx-auto mt-2">
                    In der Vollversion können hier PDFs direkt im Browser als Flipbook oder Vorschau gerendert werden.
                    Aktuell sind die Dateien direkt verlinkt.
                </p>
            </div>
        `;
    },

    toggleVisibility: (type, id) => {
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        const item = db[type].find(i => i.id === id);
        if (item) {
            item.visible = !item.visible;
            localStorage.setItem('el_alem_data', JSON.stringify(db));
            ADMIN.renderDashboard(); // Re-render
        }
    },

    deleteItem: (type, id) => {
        if(!confirm('Wirklich löschen?')) return;
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        db[type] = db[type].filter(i => i.id !== id);
        localStorage.setItem('el_alem_data', JSON.stringify(db));
        ADMIN.renderDashboard();
    },

    deleteComment: (id) => {
        if(!confirm('Kommentar wirklich löschen?')) return;
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        if(db.comments) {
            db.comments = db.comments.filter(c => c.id !== id);
            localStorage.setItem('el_alem_data', JSON.stringify(db));
            ADMIN.renderDashboard();
        }
    },

    updateRequestStatus: (id, status) => {
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        const item = db.requests.find(i => i.id === id);
        if (item) {
            item.status = status;
            localStorage.setItem('el_alem_data', JSON.stringify(db));
            // No full re-render needed, just visual feedback maybe
        }
    },

    // --- MODALS (Simulated with Prompts for simplicity in prototype, or simple overlay) ---
    // For a better UX, I'll inject a simple Modal HTML

    openWorkModal: (id = null) => {
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        const work = id ? db.works.find(w => w.id === id) : { title: '', category: 'Gemälde', serie: 'none', price: '', technique: '', year: new Date().getFullYear(), image: '/assets/placeholder.jpg' };
        
        const modalHtml = `
            <div id="admin-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white p-8 max-w-lg w-full shadow-2xl rounded">
                    <h2 class="text-2xl font-serif mb-6">${id ? 'Werk bearbeiten' : 'Neues Werk'}</h2>
                    <form onsubmit="ADMIN.saveWork(event, '${id || ''}')" class="space-y-4">
                        <div>
                            <label class="block text-xs uppercase text-gray-500 mb-1">Titel</label>
                            <input name="title" value="${work.title}" class="w-full border p-2 text-sm" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs uppercase text-gray-500 mb-1">Kategorie</label>
                                <select name="category" class="w-full border p-2 text-sm">
                                    <option value="Gemälde" ${work.category === 'Gemälde' ? 'selected' : ''}>Gemälde</option>
                                    <option value="Lichtkunst" ${work.category === 'Lichtkunst' ? 'selected' : ''}>Lichtkunst</option>
                                    <option value="Texte" ${work.category === 'Texte' ? 'selected' : ''}>Texte</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs uppercase text-gray-500 mb-1">Serie</label>
                                <select name="serie" class="w-full border p-2 text-sm">
                                    <option value="none">Keine Serie</option>
                                    ${db.series.filter(s => s.id !== 'none').map(s => `
                                        <option value="${s.id}" ${work.serie === s.id ? 'selected' : ''}>${s.title}</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs uppercase text-gray-500 mb-1">Technik</label>
                                <input name="technique" value="${work.technique}" class="w-full border p-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs uppercase text-gray-500 mb-1">Jahr</label>
                                <input name="year" value="${work.year}" class="w-full border p-2 text-sm">
                            </div>
                        </div>
                         <div>
                            <label class="block text-xs uppercase text-gray-500 mb-1">Preis</label>
                            <input name="price" value="${work.price}" class="w-full border p-2 text-sm">
                        </div>
                        
                        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button type="button" onclick="document.getElementById('admin-modal').remove()" class="px-4 py-2 text-sm text-gray-500 hover:text-black">Abbrechen</button>
                            <button type="submit" class="px-6 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800">Speichern</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    saveWork: (e, id) => {
        e.preventDefault();
        const form = e.target;
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        
        const workData = {
            title: form.title.value,
            category: form.category.value,
            serie: form.serie.value,
            technique: form.technique.value,
            year: form.year.value,
            price: form.price.value,
            visible: true
        };

        if (id) {
            // Update
            const idx = db.works.findIndex(w => w.id === id);
            db.works[idx] = { ...db.works[idx], ...workData };
        } else {
            // Create
            workData.id = 'w' + Date.now();
            workData.image = '/assets/placeholder.jpg'; // Mock image
            db.works.unshift(workData);
        }

        // Update Series Count logic could go here
        
        localStorage.setItem('el_alem_data', JSON.stringify(db));
        document.getElementById('admin-modal').remove();
        ADMIN.renderDashboard();
    },

    openSerieModal: (id = null) => {
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        const serie = id ? db.series.find(s => s.id === id) : { title: '', category: 'Gemälde', year: '', description: '', technique: '' };
        
        const modalHtml = `
            <div id="admin-modal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white p-8 max-w-lg w-full shadow-2xl rounded">
                    <h2 class="text-2xl font-serif mb-6">${id ? 'Serie bearbeiten' : 'Neue Serie'}</h2>
                    <form onsubmit="ADMIN.saveSerie(event, '${id || ''}')" class="space-y-4">
                        <div>
                            <label class="block text-xs uppercase text-gray-500 mb-1">Titel</label>
                            <input name="title" value="${serie.title}" class="w-full border p-2 text-sm" required>
                        </div>
                        <div>
                            <label class="block text-xs uppercase text-gray-500 mb-1">Kategorie</label>
                            <select name="category" class="w-full border p-2 text-sm">
                                <option value="Gemälde" ${serie.category === 'Gemälde' ? 'selected' : ''}>Gemälde</option>
                                <option value="Lichtkunst" ${serie.category === 'Lichtkunst' ? 'selected' : ''}>Lichtkunst</option>
                            </select>
                        </div>
                         <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs uppercase text-gray-500 mb-1">Technik</label>
                                <input name="technique" value="${serie.technique}" class="w-full border p-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-xs uppercase text-gray-500 mb-1">Jahr</label>
                                <input name="year" value="${serie.year}" class="w-full border p-2 text-sm">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs uppercase text-gray-500 mb-1">Beschreibung</label>
                            <textarea name="description" class="w-full border p-2 text-sm h-24">${serie.description}</textarea>
                        </div>
                        
                        <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button type="button" onclick="document.getElementById('admin-modal').remove()" class="px-4 py-2 text-sm text-gray-500 hover:text-black">Abbrechen</button>
                            <button type="submit" class="px-6 py-2 bg-black text-white text-sm uppercase tracking-wider hover:bg-gray-800">Speichern</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    saveSerie: (e, id) => {
        e.preventDefault();
        const form = e.target;
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        
        const serieData = {
            title: form.title.value,
            category: form.category.value,
            technique: form.technique.value,
            year: form.year.value,
            description: form.description.value,
            visible: true
        };

        if (id) {
            // Update
            const idx = db.series.findIndex(s => s.id === id);
            db.series[idx] = { ...db.series[idx], ...serieData };
        } else {
            // Create
            serieData.id = 's' + Date.now();
            serieData.count = 0;
            db.series.unshift(serieData);
        }

        localStorage.setItem('el_alem_data', JSON.stringify(db));
        document.getElementById('admin-modal').remove();
        ADMIN.renderDashboard();
    }
};

window.addEventListener('hashchange', () => {
    ADMIN.renderSidebar();
    ADMIN.renderDashboard();
});

document.addEventListener('DOMContentLoaded', ADMIN.init);
