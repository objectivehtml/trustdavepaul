import eventsData from './events.json';
import './style.css';

const { createApp, ref, onMounted, computed } = Vue;

createApp({
    setup() {
        const mobileMenuOpen = ref(false);
        const events = ref(eventsData);
        const now = new Date();

        const upcomingEvents = computed(() => {
            return events.value
                .filter(event => {
                    return new Date(event.endDate) >= now;
                })
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        });

        const formatMonth = (dateStr) => {
            return new Date(dateStr).toLocaleString('en-US', { month: 'short' });
        };

        const formatDate = (dateStr) => {
            return new Date(dateStr).getDate();
        };

        const formatTime = (dateStr) => {
            return new Date(dateStr).toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit', 
                hour12: true 
            });
        };

        const getDirectionsLink = (address) => {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        };

        const initObserver = () => {
            const navLinks = document.querySelectorAll('nav a[href^="#"]');
            const sections = document.querySelectorAll('section[id]');

            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            };

            const observerCallback = (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            } else {
                                link.classList.remove('active');
                            }
                        });
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            sections.forEach(section => observer.observe(section));
        };

        onMounted(() => {
            initObserver();
        });

        return {
            mobileMenuOpen,
            upcomingEvents,
            formatMonth,
            formatDate,
            formatTime,
            getDirectionsLink
        };
    }
}).mount('#app');
