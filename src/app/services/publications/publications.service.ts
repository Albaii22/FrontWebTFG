import { Injectable } from '@angular/core';
import { PublicationI } from '../../interfaces/publications.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private urlPublications = 'http://localhost:8082/api/publications';

  constructor(private http: HttpClient) {}

  getAllPublications(): Observable<PublicationI[]> {
    return this.http.get<PublicationI[]>(this.urlPublications);
  }

  getPublicationById(id: number): Observable<PublicationI> {
    return this.http.get<PublicationI>(`${this.urlPublications}/${id}`);
  }

  getPublicationsByUserId(id: number): Observable<PublicationI[]> {
    return this.http.get<PublicationI[]>(`${this.urlPublications}/user/${id}`);
  }

  createPublication(publication: PublicationI, userId: number): Observable<PublicationI> {
    return this.http.post<PublicationI>(`${this.urlPublications}/${userId}`, publication);
  }

  updatePublication(id: number, publication: PublicationI): Observable<PublicationI> {
    return this.http.put<PublicationI>(`${this.urlPublications}/${id}`, publication);
  }

  deletePublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlPublications}/${id}`);
  }

  getUsernameByPublicationId(publicationId: number): Observable<string> {
    const url = `${this.urlPublications}/${publicationId}/username`;
    return this.http.get<string>(url);
  }
}
