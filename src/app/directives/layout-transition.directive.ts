import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appLayoutTransition]',
  standalone: true
})
export class LayoutTransitionDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Apply CSS containing property to help with layout transitions
    this.el.nativeElement.style.contain = 'layout';
    
    // Set up IntersectionObserver to handle visibility-based optimizations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element is visible
          entry.target.classList.add('visible');
        } else {
          // Element is not visible
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all relevant child elements
    const childElements = this.el.nativeElement.querySelectorAll('.artist-card, .event-card');
    childElements.forEach((element: Element) => {
      observer.observe(element);
    });
  }
}