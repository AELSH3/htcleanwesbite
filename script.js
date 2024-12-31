// Wrap all JavaScript code inside DOMContentLoaded to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000, // Animation duration in milliseconds
        once: true, // Whether animation should happen only once
    });

    // Initialize EmailJS
    (function(){
        emailjs.init('OTRx9bYwEv5sMYFlJ'); // Replace with your actual EmailJS User ID
    })();

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the form from reloading the page

            // Send the form data using EmailJS
            emailjs.sendForm('service_l603k4o', 'template_tt93ykm', this) // Replace with your service ID and template ID
                .then(function(response) {
                    alert('Message sent successfully! Thank you.');
                    console.log('Success:', response.status, response.text);
                    contactForm.reset();
                }, function(error) {
                    alert('Failed to send message. Please try again later.');
                    console.error('Error:', error);
                });
        });
    }

    // Initialize Swiper.js for Testimonials Carousel
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        loop: true,
        autoplay: {
            delay: 7000,
            disableOnInteraction: false,
        },
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
            nextEl: '.testimonials-swiper .swiper-button-next',
            prevEl: '.testimonials-swiper .swiper-button-prev',
        },
        pagination: {
            el: '.testimonials-swiper .swiper-pagination',
            clickable: true,
        },
    });

    // Slider Functionality for Our Work Section
    const workSliderImages = document.querySelector('.slider-images');
    const workImages = document.querySelectorAll('.slider-images img');
    const prevWorkButton = document.querySelector('.slider .prev');
    const nextWorkButton = document.querySelector('.slider .next');

    let currentWorkIndex = 0;

    if (workImages.length > 0) {
        // Clone first and last images for infinite loop effect
        const firstWorkClone = workImages[0].cloneNode(true);
        const lastWorkClone = workImages[workImages.length - 1].cloneNode(true);

        workSliderImages.appendChild(firstWorkClone);
        workSliderImages.insertBefore(lastWorkClone, workImages[0]);

        const totalWorkImages = workSliderImages.children.length;
        let workImageWidth = workImages[0].clientWidth;
        workSliderImages.style.transform = `translateX(-${workImageWidth}px)`;

        // Handle Window Resize
        window.addEventListener('resize', () => {
            workImageWidth = workImages[0].clientWidth;
            workSliderImages.style.transition = 'none';
            workSliderImages.style.transform = `translateX(-${workImageWidth * (currentWorkIndex + 1)}px)`;
        });

        // Transition End Event
        workSliderImages.addEventListener('transitionend', () => {
            const current = workSliderImages.children[currentWorkIndex + 1];
            if (current === firstWorkClone) {
                workSliderImages.style.transition = 'none';
                workSliderImages.style.transform = `translateX(-${workImageWidth}px)`;
                currentWorkIndex = 0;
            }
            if (current === lastWorkClone) {
                workSliderImages.style.transition = 'none';
                workSliderImages.style.transform = `translateX(-${workImageWidth * (totalWorkImages - 2)}px)`;
                currentWorkIndex = totalWorkImages - 3;
            }
        });

        // Show Previous Image
        function showPrevWorkImage() {
            if (currentWorkIndex <= -1) return;
            currentWorkIndex--;
            workSliderImages.style.transition = 'transform 0.5s ease-in-out';
            workSliderImages.style.transform = `translateX(-${workImageWidth * (currentWorkIndex + 1)}px)`;
        }

        // Show Next Image
        function showNextWorkImage() {
            if (currentWorkIndex >= totalWorkImages - 2) return;
            currentWorkIndex++;
            workSliderImages.style.transition = 'transform 0.5s ease-in-out';
            workSliderImages.style.transform = `translateX(-${workImageWidth * (currentWorkIndex + 1)}px)`;
        }

        // Event Listeners for Work Slider Buttons
        prevWorkButton.addEventListener('click', showPrevWorkImage);
        nextWorkButton.addEventListener('click', showNextWorkImage);

        // Swipe Support for Our Work Slider
        let workTouchStartX = 0;
        let workTouchEndX = 0;

        workSliderImages.addEventListener('touchstart', (e) => {
            workTouchStartX = e.changedTouches[0].screenX;
        });

        workSliderImages.addEventListener('touchend', (e) => {
            workTouchEndX = e.changedTouches[0].screenX;
            handleWorkGesture();
        });

        function handleWorkGesture() {
            if (workTouchEndX < workTouchStartX - 50) {
                showNextWorkImage();
            }
            if (workTouchEndX > workTouchStartX + 50) {
                showPrevWorkImage();
            }
        }
    }

    // Smooth scroll function for better easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // Dynamic Pricing Calculator Functionality
    const pricingFormCalc = document.getElementById('pricing-form');
    const totalPriceElementCalc = document.getElementById('total-price');

    if (pricingFormCalc && totalPriceElementCalc) {
        pricingFormCalc.addEventListener('change', calculateTotal);
        pricingFormCalc.addEventListener('input', calculateTotal);

        function calculateTotal() {
            let total = 0;
            const selectedServices = pricingFormCalc.querySelectorAll('input[name="services"]:checked');
            selectedServices.forEach(service => {
                total += parseFloat(service.value);
            });

            const additionalServices = parseInt(pricingFormCalc.querySelector('input[name="additional"]').value) || 0;
            total += additionalServices * 10;

            totalPriceElementCalc.textContent = total;
        }
    }

    /* ========================================
       4. Before and After Slider Functionality
    ======================================== */

    const beforeAfterSlider = document.querySelector('.before-after-slider');
    const sliderHandle = beforeAfterSlider.querySelector('.slider-handle');
    const afterImage = beforeAfterSlider.querySelector('.after-image');

    let isDragging = false;

    // Function to handle the dragging
    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', stopDrag);
    }

    function onDrag(e) {
        if (!isDragging) return;

        // Get the position of the cursor
        let clientX;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        // Get the bounding rectangle of the slider
        const rect = beforeAfterSlider.getBoundingClientRect();

        // Calculate the position relative to the slider
        let position = clientX - rect.left;

        // Clamp the position between 0 and the width of the slider
        position = Math.max(0, Math.min(position, rect.width));

        // Calculate the percentage
        const percentage = (position / rect.width) * 100;

        // Update the width of the after image
        afterImage.style.width = `${percentage}%`;

        // Move the handle
        sliderHandle.style.left = `${percentage}%`;
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', stopDrag);
    }

    // Initialize the slider to start at 50%
    window.addEventListener('load', () => {
        afterImage.style.width = '50%';
        sliderHandle.style.left = '50%';
    });

    // Add event listeners to the handle
    sliderHandle.addEventListener('mousedown', startDrag);
    sliderHandle.addEventListener('touchstart', startDrag);

    // Accessibility: Allow keyboard controls for the slider
    sliderHandle.setAttribute('tabindex', '0'); // Make the handle focusable

    sliderHandle.addEventListener('keydown', function(e) {
        const step = 5; // Percentage step per key press
        let currentWidth = parseFloat(afterImage.style.width);
        if (e.key === 'ArrowLeft') {
            currentWidth = Math.max(0, currentWidth - step);
            afterImage.style.width = `${currentWidth}%`;
            sliderHandle.style.left = `${currentWidth}%`;
        } else if (e.key === 'ArrowRight') {
            currentWidth = Math.min(100, currentWidth + step);
            afterImage.style.width = `${currentWidth}%`;
            sliderHandle.style.left = `${currentWidth}%`;
        }
    });
});


// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionButton.addEventListener('click', () => {
            const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded attribute
            questionButton.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                // Expand the answer
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                // Collapse the answer
                answer.style.maxHeight = null;
            }
        });
    });
});


// Service Recommendation Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quiz-form');
    const quizResult = document.getElementById('quiz-result');

    quizForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Gather form data
        const vehicleType = quizForm.elements['vehicle-type'].value;
        const focusAreas = Array.from(quizForm.elements['focus-area'])
                                .filter(checkbox => checkbox.checked)
                                .map(checkbox => checkbox.value);
        const concerns = Array.from(quizForm.elements['concerns'])
                            .filter(checkbox => checkbox.checked)
                            .map(checkbox => checkbox.value);
        const frequency = quizForm.elements['frequency'].value;

        // Determine recommendations based on answers
        let recommendations = [];

        // Basic logic for recommendations (you can expand this logic as needed)
        if (focusAreas.includes('Exterior')) {
            recommendations.push('Exterior Detail');
        }
        if (focusAreas.includes('Interior')) {
            recommendations.push('Interior Detailing');
        }
        if (focusAreas.includes('Full-Service')) {
            recommendations.push('Full-Service Detailing');
        }
        if (concerns.includes('Scratches')) {
            recommendations.push('Exterior Polish');
        }
        if (concerns.includes('Odors')) {
            recommendations.push('Interior Detailing');
        }
        if (concerns.includes('Stains')) {
            recommendations.push('Interior Detailing');
        }
        if (concerns.includes('Waxing')) {
            recommendations.push('Waxing Services');
        }

        // Remove duplicate recommendations
        recommendations = [...new Set(recommendations)];

        // Format the recommendations for display
        if (recommendations.length === 0) {
            recommendations.push('Please contact us for a personalized service recommendation.');
        }

        // Display the recommendations
        let resultHTML = '<h3>Your Recommended Services:</h3><ul>';
        recommendations.forEach(service => {
            resultHTML += `<li>${service}</li>`;
        });
        resultHTML += '</ul><p class="pricing-disclaimer">*Pricing is subject to change based on vehicle condition and selected services.</p>';

        quizResult.innerHTML = resultHTML;
        quizResult.style.display = 'block';
        
        // Scroll to the result
        quizResult.scrollIntoView({ behavior: 'smooth' });
    });
});
