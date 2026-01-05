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
        } else if (view === '#requests') {
            ADMIN.renderRequestsList(content, db);
        }
    },

    renderWorksList: (container, db) => {
        container.innerHTML = `
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-serif">Werke verwalten</h1>
                <button onclick="alert('Mock: Hier würde der Create-Dialog aufgehen.')" class="bg-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800">Neues Werk</button>
            </div>
            <div class="bg-white border border-gray-100 overflow-hidden">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                        <tr>
                            <th class="p-4 w-16">Bild</th>
                            <th class="p-4">Titel</th>
                            <th class="p-4">Kategorie</th>
                            <th class="p-4">Status</th>
                            <th class="p-4 text-right">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${db.works.map(w => `
                            <tr>
                                <td class="p-4"><img src="${w.image}" class="w-10 h-10 object-cover bg-gray-100"></td>
                                <td class="p-4 font-medium">${w.title}</td>
                                <td class="p-4 text-gray-500">${w.category}</td>
                                <td class="p-4">
                                    <button onclick="ADMIN.toggleVisibility('works', '${w.id}')" class="px-2 py-1 text-xs rounded-full ${w.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}">
                                        ${w.visible ? 'Sichtbar' : 'Versteckt'}
                                    </button>
                                </td>
                                <td class="p-4 text-right space-x-2">
                                    <button class="text-blue-600 hover:underline">Bearbeiten</button>
                                    <button onclick="ADMIN.deleteItem('works', '${w.id}')" class="text-red-600 hover:underline">Löschen</button>
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

    updateRequestStatus: (id, status) => {
        const db = JSON.parse(localStorage.getItem('el_alem_data'));
        const item = db.requests.find(i => i.id === id);
        if (item) {
            item.status = status;
            localStorage.setItem('el_alem_data', JSON.stringify(db));
            // No full re-render needed, just visual feedback maybe
        }
    }
};

window.addEventListener('hashchange', () => {
    ADMIN.renderSidebar();
    ADMIN.renderDashboard();
});

document.addEventListener('DOMContentLoaded', ADMIN.init);
