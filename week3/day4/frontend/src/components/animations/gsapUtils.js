import gsap from 'gsap';

// Fade in animation
export const fadeIn = (element, options = {}) => {
  const { delay = 0, duration = 0.8, y = 30 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, ease: 'power3.out' }
  );
};

// Slide up animation
export const slideUp = (element, options = {}) => {
  const { delay = 0, duration = 0.8, y = 60 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, ease: 'power4.out' }
  );
};

// Slide in from left
export const slideInLeft = (element, options = {}) => {
  const { delay = 0, duration = 0.8, x = -80 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, x },
    { opacity: 1, x: 0, duration, delay, ease: 'power3.out' }
  );
};

// Slide in from right
export const slideInRight = (element, options = {}) => {
  const { delay = 0, duration = 0.8, x = 80 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, x },
    { opacity: 1, x: 0, duration, delay, ease: 'power3.out' }
  );
};

// Scale in animation
export const scaleIn = (element, options = {}) => {
  const { delay = 0, duration = 0.6 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration, delay, ease: 'back.out(1.7)' }
  );
};

// Stagger children animation
export const staggerIn = (elements, options = {}) => {
  const { delay = 0, duration = 0.6, stagger = 0.1, y = 40 } = options;
  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, stagger, ease: 'power3.out' }
  );
};

// Count-up animation for numbers
export const countUp = (element, endValue, options = {}) => {
  const { duration = 2, delay = 0 } = options;
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    delay,
    ease: 'power2.out',
    onUpdate: () => {
      if (element) {
        element.textContent = Math.round(obj.value);
      }
    },
  });
};

// Page transition - enter
export const pageEnter = (element, options = {}) => {
  const { duration = 0.6 } = options;
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, ease: 'power2.out' }
  );
};

// Page transition - exit
export const pageExit = (element, options = {}) => {
  const { duration = 0.3 } = options;
  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration,
    ease: 'power2.in',
  });
};

// Hover scale effect
export const hoverScale = (element, scale = 1.05) => {
  const enterAnim = () => gsap.to(element, { scale, duration: 0.3, ease: 'power2.out' });
  const leaveAnim = () => gsap.to(element, { scale: 1, duration: 0.3, ease: 'power2.out' });
  
  element.addEventListener('mouseenter', enterAnim);
  element.addEventListener('mouseleave', leaveAnim);
  
  return () => {
    element.removeEventListener('mouseenter', enterAnim);
    element.removeEventListener('mouseleave', leaveAnim);
  };
};

// Floating animation (continuous)
export const floating = (element, options = {}) => {
  const { y = 15, duration = 2.5 } = options;
  return gsap.to(element, {
    y,
    duration,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });
};

// GSAP Timeline helper
export const createTimeline = (options = {}) => {
  return gsap.timeline(options);
};

// Notification animation
export const notificationPop = (element) => {
  const tl = gsap.timeline();
  tl.fromTo(
    element,
    { opacity: 0, scale: 0.5, y: -20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }
  )
    .to(element, { scale: 1.05, duration: 0.15, ease: 'power2.out' }, '+=0.1')
    .to(element, { scale: 1, duration: 0.15, ease: 'power2.out' });
  return tl;
};
