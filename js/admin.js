tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" }
            }
        },
        fontFamily: {
            'body': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ],
            'sans': [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'system-ui',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ]
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // ## sidebar toggle
    const toggleButton = document.getElementById('drawer-toggle');
    const drawer = document.getElementById('drawer-navigation');
    const drawerFooter = document.getElementById('drawer-footer');
    const mainContent = document.querySelector('main');
    const sidebarWidth = '60px';

    // Dynamically create the overlay element
    const overlay = document.createElement('div');
    overlay.id = 'drawer-overlay';
    overlay.className = 'fixed inset-0 z-30 bg-black bg-opacity-50 hidden';

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Check if there's a saved drawer state in localStorage
    const savedDrawerState = localStorage.getItem('drawerState');

    if (savedDrawerState) {
        // Apply the saved state
        if (savedDrawerState === sidebarWidth) {
            drawer.style.width = sidebarWidth;
            mainContent.classList.remove('md:ml-64');
            mainContent.classList.add('md:ml-20');

            drawerFooter.classList.remove('flex');
            drawerFooter.classList.add('grid');
            drawerFooter.classList.remove('space-x-4');
            drawerFooter.classList.add('space-y-2');
        } else {
            drawer.style.width = '256px';
            mainContent.classList.remove('md:ml-20');
            mainContent.classList.add('md:ml-64');

            drawerFooter.classList.remove('grid');
            drawerFooter.classList.add('flex');
            drawerFooter.classList.remove('space-y-2');
            drawerFooter.classList.add('space-x-4');
        }
    }

    if (toggleButton && drawer && overlay) {
        // when clicked on the toggle button
        toggleButton.addEventListener('click', function() {
            const screenWidth = window.innerWidth;

            // drawer footer set grid to flex
            drawerFooter.classList.toggle('flex');
            drawerFooter.classList.toggle('grid');
            drawerFooter.classList.toggle('space-y-2');
            drawerFooter.classList.toggle('space-x-4');

            // for tablet & mobile view, do a simple toggle
            if (screenWidth <= 768) {
                drawer.style.width = '256px';
                drawer.classList.toggle('-translate-x-full');
                overlay.classList.toggle('hidden');

                drawerFooter.classList.remove('grid');
                drawerFooter.classList.add('flex');
                drawerFooter.classList.remove('space-y-2');
                drawerFooter.classList.add('space-x-4');
            }
            // for bigger screen size, change drawer width
            else {
                if (drawer.style.width === sidebarWidth) {
                    drawer.style.width = '256px';
                    mainContent.classList.remove('md:ml-20');
                    mainContent.classList.add('md:ml-64');

                    localStorage.setItem('drawerState', '256px');
                } else {
                    drawer.style.width = sidebarWidth;
                    mainContent.classList.remove('md:ml-64');
                    mainContent.classList.add('md:ml-20');

                    localStorage.setItem('drawerState', sidebarWidth);
                }
            }
        });

        overlay.addEventListener('click', function() {
            drawer.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        });
    }



    // ## dropdown
    const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');

    dropdownToggles.forEach(toggle => {
        const targetDropdownId = toggle.getAttribute('data-dropdown-toggle');
        const dropdownMenu = document.getElementById(targetDropdownId);

        toggle.addEventListener('click', function () {
            dropdownMenu.classList.add('absolute', 'w-max');
            dropdownMenu.classList.toggle('hidden');
            dropdownMenu.classList.toggle('block');

            const toggleRect = toggle.getBoundingClientRect();
            const dropdownHeight = dropdownMenu.offsetHeight;
            const dropdownWidth = dropdownMenu.offsetWidth;
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            // Check if there's enough space below the button
            if (toggleRect.bottom + dropdownHeight > viewportHeight) {
                // Not enough space below, open above the button
                dropdownMenu.style.top = 'auto';
                dropdownMenu.style.bottom = `calc(100% - 0.75rem)`;
            } else {
                // Enough space below, open below the button
                dropdownMenu.style.bottom = 'auto';
                dropdownMenu.style.top = `calc(100% - 0.75rem)`;
            }

            // Check if there's enough space on the right side of the screen
            if (toggleRect.right + dropdownWidth > viewportWidth) {
                // Not enough space on the right, align dropdown to the left side of the button
                dropdownMenu.style.left = 'auto';
                dropdownMenu.style.right = `1rem`;
            } else if (toggleRect.left < 0) {
                // Not enough space on the left, align dropdown to the right side of the button
                dropdownMenu.style.left = `0.5rem`;
                dropdownMenu.style.right = 'auto';
            } else {
                // Dropdown fits properly, reset any previous left/right adjustments
                dropdownMenu.style.top = `calc(100% - 11rem)`;
                dropdownMenu.style.right = 'auto';
                dropdownMenu.style.bottom = 'auto';
                dropdownMenu.style.left = '4rem';
            }
        });
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', function (event) {
        dropdownToggles.forEach(toggle => {
            const targetDropdownId = toggle.getAttribute('data-dropdown-toggle');
            const dropdownMenu = document.getElementById(targetDropdownId);
            
            if (!toggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.add('hidden');
                dropdownMenu.classList.remove('block');
            }
        });
    });



    // ## collapse
    const collapseToggles = document.querySelectorAll('[data-collapse-toggle]');

    collapseToggles.forEach(toggle => {
        const targetCollapseId = toggle.getAttribute('data-collapse-toggle');
        const collapseMenu = document.getElementById(targetCollapseId);
        const collapseIcon = toggle.querySelector('.collapse-icon');

        toggle.addEventListener('click', function () {
            collapseMenu.classList.toggle('hidden');
            collapseMenu.classList.toggle('block');

            if (collapseMenu.classList.contains('block') && collapseIcon) {
                // Change the collapse-icon to an up arrow
                // collapseIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-496 296-312l-88-88 272-272 272 272-88 88-184-184Z"/></svg>`;
                collapseIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 sm:w-6 sm:h-6" viewBox="0 -960 960 960" fill="currentColor"><path d="m480-520.35-184 184L232.35-400 480-647.65 727.65-400 664-336.35l-184-184Z"/></svg>`;
            } else if (collapseIcon) {
                // Change the collapse-icon back to a down arrow
                collapseIcon.innerHTML = `<svg aria-hidden="true" class="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;
            }
        });
    });
});
