    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const isOpen = mobileMenu.classList.contains('active');
      menuBtn.innerHTML = isOpen 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke-width="2"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12" stroke-width="2"/><line x1="3" y1="6" x2="21" y2="6" stroke-width="2"/><line x1="3" y1="18" x2="21" y2="18" stroke-width="2"/></svg>';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" y1="12" x2="21" y2="12" stroke-width="2"/><line x1="3" y1="6" x2="21" y2="6" stroke-width="2"/><line x1="3" y1="18" x2="21" y2="18" stroke-width="2"/></svg>';
      });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Form Submission
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toast');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span>SUBMITTING...';

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success toast
      toast.classList.add('show');
      
      // Reset form
      form.reset();
      
      // Re-enable button
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'SUBMIT REGISTRATION';

      // Hide toast after 5 seconds
      setTimeout(() => {
        toast.classList.remove('show');
      }, 5000);
    });

    // Hide toast on click
    toast.addEventListener('click', () => {
      toast.classList.remove('show');
    }); 