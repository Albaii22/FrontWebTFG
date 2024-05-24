import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentsI } from '../../interfaces/comments.interface'; // Import comments interface

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'http://localhost:8082/api/comments'; // URL for comments API

  constructor(private http: HttpClient) { }

  // Method to get all comments
  getAllComments(): Observable<CommentsI[]> {
    return this.http.get<CommentsI[]>(`${this.apiUrl}`);
  }

  // Method to get comment by ID
  getCommentById(id: number): Observable<CommentsI> {
    return this.http.get<CommentsI>(`${this.apiUrl}/${id}`);
  }

  // Method to create a new comment
  createComment(comment: CommentsI, userId: number): Observable<CommentsI> {
    return this.http.post<CommentsI>(`${this.apiUrl}/${userId}`, comment);
  }

  // Method to update an existing comment
  updateComment(id: number, comment: CommentsI): Observable<CommentsI> {
    return this.http.put<CommentsI>(`${this.apiUrl}/${id}`, comment);
  }

  // Method to delete a comment by ID
  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Method to get comments by publication ID
  getCommentsByPublicationId(publicationId: number): Observable<CommentsI[]> {
    return this.http.get<CommentsI[]>(`${this.apiUrl}/publication/${publicationId}`);
  }
}
