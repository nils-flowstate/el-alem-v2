/**
 * Simple Flipbook Logic
 * Simulates a book turning effect.
 */

class Flipbook {
    constructor(containerId, pages) {
        this.container = document.getElementById(containerId);
        this.pages = pages;
        this.currentPage = 0;
        this.init();
    }

    init() {
        if (!this.container) return;
        this.container.classList.add('perspective-1000', 'relative', 'w-full', 'max-w-2xl', 'mx-auto', 'aspect-[3/2]');
        
        this.render();
        this.setupControls();
    }

    render() {
        // Render 2 pages at a time (Left and Right)
        // For simplicity in this mock, we just show 1 page centered that flips?
        // Or a spread. Let's do a simple Next/Prev slider with 3D effect.
        
        this.container.innerHTML = `
            <div class="relative w-full h-full bg-white shadow-2xl flex border border-gray-200 overflow-hidden">
                <!-- Left Page -->
                <div class="w-1/2 h-full p-8 border-r border-gray-100 flex items-center justify-center bg-[#fdfbf7]">
                    <div id="page-left-content" class="text-center w-full">
                        ${this.getPageContent(this.currentPage)}
                    </div>
                </div>
                <!-- Right Page -->
                <div class="w-1/2 h-full p-8 flex items-center justify-center bg-[#fdfbf7]">
                    <div id="page-right-content" class="text-center w-full">
                         ${this.getPageContent(this.currentPage + 1)}
                    </div>
                </div>
                
                <!-- Overlay Shadows for depth -->
                <div class="absolute inset-y-0 left-1/2 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
                <div class="absolute inset-y-0 right-1/2 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
            </div>

            <!-- Controls -->
            <button id="prev-btn" class="absolute top-1/2 -left-12 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors ${this.currentPage === 0 ? 'opacity-20 cursor-not-allowed' : ''}">
                <i class="ph ph-caret-left text-2xl"></i>
            </button>
            <button id="next-btn" class="absolute top-1/2 -right-12 transform -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors ${this.currentPage >= this.pages.length - 2 ? 'opacity-20 cursor-not-allowed' : ''}">
                <i class="ph ph-caret-right text-2xl"></i>
            </button>
            
            <div class="text-center mt-4 text-xs tracking-widest text-gray-400">
                SEITE ${this.currentPage + 1} - ${Math.min(this.currentPage + 2, this.pages.length)} VON ${this.pages.length}
            </div>
        `;
    }

    getPageContent(index) {
        if (index >= this.pages.length) return '<div class="text-gray-300">Ende</div>';
        const page = this.pages[index];
        if (page.type === 'image') {
            return `<img src="${page.src}" class="max-w-full max-h-[400px] object-contain mx-auto shadow-sm">`;
        } else {
            return `
                <h3 class="font-serif text-xl mb-4">${page.title || ''}</h3>
                <p class="font-light text-sm leading-relaxed text-left">${page.text || ''}</p>
            `;
        }
    }

    setupControls() {
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (this.currentPage > 0) {
                this.currentPage -= 2;
                this.render();
                this.setupControls(); // Re-bind
            }
        });
        document.getElementById('next-btn').addEventListener('click', () => {
            if (this.currentPage < this.pages.length - 2) {
                this.currentPage += 2;
                this.render();
                this.setupControls();
            }
        });
    }
}
