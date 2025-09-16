import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';

interface Artist {
  id: number;
  name: string;
  genre: string;
  image: string;
  followers: number;
  isFollowing: boolean;
}

@Component({
  selector: 'app-usuarios-seguidos',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './usuarios-seguidos.html',
  styleUrl: './usuarios-seguidos.scss'
})
export class UsuariosSeguidos implements OnInit {
  followedArtists: Artist[] = [];
  loading = true;
  searchTerm = '';
  filteredArtists: Artist[] = [];

  ngOnInit(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.followedArtists = [
        {
          id: 1,
          name: 'Luna Nova',
          genre: 'Indie Pop',
          image: 'assets/logo/images/artist1.jpg',
          followers: 1240,
          isFollowing: true
        },
        {
          id: 2,
          name: 'Cosmic Waves',
          genre: 'Synth Rock',
          image: 'assets/logo/images/artist2.jpg',
          followers: 980,
          isFollowing: true
        },
        {
          id: 3,
          name: 'Electric Pulse',
          genre: 'Electronic',
          image: 'assets/logo/images/artist3.jpg',
          followers: 1560,
          isFollowing: true
        },
        {
          id: 4,
          name: 'Velvet Sound',
          genre: 'Alternative',
          image: 'assets/logo/images/artist4.jpg',
          followers: 2300,
          isFollowing: true
        },
        {
          id: 5,
          name: 'Midnight Echo',
          genre: 'Dream Pop',
          image: 'assets/logo/images/artist1.jpg',
          followers: 890,
          isFollowing: true
        }
      ];
      this.filteredArtists = [...this.followedArtists];
      this.loading = false;
    }, 1000);
  }

  search(event: any): void {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    
    if (!value) {
      this.filteredArtists = [...this.followedArtists];
      return;
    }
    
    this.filteredArtists = this.followedArtists.filter(artist => 
      artist.name.toLowerCase().includes(value) || 
      artist.genre.toLowerCase().includes(value)
    );
  }

  toggleFollow(artist: Artist): void {
    artist.isFollowing = !artist.isFollowing;
    
    if (!artist.isFollowing) {
      // Remove from followed list after a short delay for animation
      setTimeout(() => {
        this.followedArtists = this.followedArtists.filter(a => a.id !== artist.id);
        this.filteredArtists = this.filteredArtists.filter(a => a.id !== artist.id);
      }, 300);
    }
  }
}