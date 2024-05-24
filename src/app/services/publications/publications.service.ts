import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicationI } from '../../interfaces/publications.interface';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private urlPublications = 'http://localhost:8082/api/publications';

  constructor(private http: HttpClient) {}

  // Retrieve all publications
  getAllPublications(): Observable<PublicationI[]> {
    return this.http.get<PublicationI[]>(this.urlPublications);
  }

  // Retrieve a publication by its ID
  getPublicationById(id: number): Observable<PublicationI> {
    return this.http.get<PublicationI>(`${this.urlPublications}/${id}`);
  }

  // Retrieve publications by user ID
  getPublicationsByUserId(id: number): Observable<PublicationI[]> {
    return this.http.get<PublicationI[]>(`${this.urlPublications}/user/${id}`);
  }

  // Create a new publication
  createPublication(publication: PublicationI, userId: number): Observable<PublicationI> {
    return this.http.post<PublicationI>(`${this.urlPublications}/${userId}`, publication);
  }

  // Update a publication
  updatePublication(id: number, publication: PublicationI): Observable<PublicationI> {
    return this.http.put<PublicationI>(`${this.urlPublications}/${id}`, publication);
  }

  // Delete a publication by its ID
  deletePublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlPublications}/${id}`);
  }

  // Retrieve the username associated with a publication ID
  getUsernameByPublicationId(publicationId: number): Observable<string> {
    const url = `${this.urlPublications}/${publicationId}/username`;
    return this.http.get<string>(url);
  }

  // Toggle like for a publication by its ID and user ID
  toggleLike(publicationId: number, userId: number): Observable<void> {
    return this.http.post<void>(`${this.urlPublications}/${publicationId}/toggle-like`, { userId });
  }
}
