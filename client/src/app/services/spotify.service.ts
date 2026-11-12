import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://127.0.0.1:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //Build the full Express URL from the base URL and the endpoint.
    var uri:string = this.expressBaseUrl + endpoint;

    //firstValueFrom generates a Promise for whatever is returned first from the GET request.
    //You shouldn't need to update this part.
    return firstValueFrom(this.http.get(uri)).then((response) => {
      return response;
    }, (err) => {
      return err;
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //Encode the search text, then map the response into the data class for the category.
    var endpoint: string = '/search/' + category + '/' + encodeURIComponent(resource);

    return this.sendRequestToExpress(endpoint).then((data) => {
      if (category === 'artist') return data.artists.items.map((a:any) => new ArtistData(a));
      if (category === 'album')  return data.albums.items.map((a:any) => new AlbumData(a));
      if (category === 'track')  return data.tracks.items.map((t:any) => new TrackData(t));
      return [];
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //Get one artist by id.
    var endpoint: string = '/artist/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new ArtistData(data);
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //Get an artist's top tracks.
    var endpoint: string = '/artist-top-tracks/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.tracks.map((t:any) => new TrackData(t));
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //Get an artist's albums.
    var endpoint: string = '/artist-albums/' + encodeURIComponent(artistId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.items.map((a:any) => new AlbumData(a));
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //Get one album by id.
    var endpoint: string = '/album/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new AlbumData(data);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //Get the tracks on an album.
    var endpoint: string = '/album-tracks/' + encodeURIComponent(albumId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return data.items.map((t:any) => new TrackData(t));
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //Get one track by id.
    var endpoint: string = '/track/' + encodeURIComponent(trackId);
    return this.sendRequestToExpress(endpoint).then((data) => {
      return new TrackData(data);
    });
  }
}