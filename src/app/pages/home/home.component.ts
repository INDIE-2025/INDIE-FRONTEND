import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventCard } from '../../components/event-card/event-card';

interface Artist {
  id: number;
  name: string;
  genre: string;
  image: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  creator: string;
  collaborator: string;
  interested: number;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, EventCard],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  featuredArtists: Artist[] = [];
  upcomingEvents: Event[] = [];
  imagesLoaded: boolean = false;
  contentReady: boolean = false;

  constructor() {}

  // TrackBy function for better rendering performance
  trackByArtistId(index: number, artist: Artist): number {
    return artist.id;
  }
  
  trackByEventId(index: number, event: Event): number {
    return event.id;
  }

  ngOnInit(): void {
    // Pre-load images to prevent glitches
    this.preloadImages();
    
    // Mock data for artists
    this.featuredArtists = [
      {
        id: 1,
        name: 'Luna Nova',
        genre: 'Indie Pop',
        image: 'assets/logo/images/artist1.jpg'
      },
      {
        id: 2,
        name: 'Cosmic Waves',
        genre: 'Synth Rock',
        image: 'assets/logo/images/artist2.jpg'
      },
      {
        id: 3,
        name: 'Electric Pulse',
        genre: 'Electronic',
        image: 'assets/logo/images/artist3.jpg'
      },
      {
        id: 4,
        name: 'Velvet Sound',
        genre: 'Alternative',
        image: 'assets/logo/images/artist4.jpg'
      }
    ];
    
    // Mock data for events
    this.upcomingEvents = [
      {
        id: 1,
        title: 'Festival Sonido Urbano',
        date: '15 JUN',
        time: '21:00 hs',
        location: 'Av. Siempre Viva',
        image: 'assets/logo/images/event1.jpg',
        creator: 'Oracle',
        collaborator: 'Juan',
        interested: 1209,
        description: 'Lorem non ut ipsum sit dolus voluptat quis que ornat, consectetur dignissim, felis Lorem et ipsum non. Quisque non felis Lorem et ipsum non. Quisque non'
      },
      {
        id: 2,
        title: 'Festival Sonido Urbano',
        date: '16 JUN',
        time: '21:00 hs',
        location: 'Av. Siempre Viva',
        image: 'assets/logo/images/event2.jpg',
        creator: 'Oracle',
        collaborator: 'Juan',
        interested: 1209,
        description: 'Lorem non ut ipsum sit dolus voluptat quis que ornat, consectetur dignissim, felis Lorem et ipsum non. Quisque non felis Lorem et ipsum non. Quisque non'
      },
      {
        id: 3,
        title: 'Festival Sonido Urbano',
        date: '18 JUN',
        time: '21:00 hs',
        location: 'Av. Siempre Viva',
        image: 'assets/logo/images/event3.jpg',
        creator: 'Oracle',
        collaborator: 'Juan',
        interested: 1209,
        description: 'Lorem non ut ipsum sit dolus voluptat quis que ornat, consectetur dignissim, felis Lorem et ipsum non. Quisque non felis Lorem et ipsum non. Quisque non'
      }
    ];
  }

  preloadImages(): void {
    // Get all image paths
    const imagePaths = [
      ...this.featuredArtists?.map(artist => artist.image) || [],
      ...this.upcomingEvents?.map(event => event.image) || [],
      'assets/logo/images/hero-bg.jpg'
    ];
    
    // Create a counter to track when all images are loaded
    let loadedCount = 0;
    
    // Set a timeout to show content even if images are slow
    setTimeout(() => {
      if (!this.imagesLoaded) {
        this.imagesLoaded = true;
        this.contentReady = true;
      }
    }, 2000);
    
    // Preload all images
    imagePaths.forEach(path => {
      if (!path) return;
      
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagePaths.filter(p => p).length) {
          this.imagesLoaded = true;
          this.contentReady = true;
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagePaths.filter(p => p).length) {
          this.imagesLoaded = true;
          this.contentReady = true;
        }
      };
      img.src = path;
    });
  }

  ngAfterViewInit(): void {
    // Set up carousel navigation listeners
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.scrollEvents('prev'));
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.scrollEvents('next'));
    }
    
    // Force layout recalculation to prevent glitches
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  // Navigation methods
  exploreEvents(): void {
    // Navigate to events page
  }

  viewArtists(): void {
    // Navigate to artists page
  }

  // Carousel navigation
  scrollEvents(direction: 'prev' | 'next'): void {
    const container = document.querySelector('.event-cards');
    if (container) {
      const scrollAmount = direction === 'next' ? 400 : -400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
