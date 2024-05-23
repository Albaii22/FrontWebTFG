import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentsI } from '../../interfaces/comments.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private apiUrl = 'http://localhost:8082/api/comments';

  constructor(private http: HttpClient) { }

  getAllComments(): Observable<CommentsI[]> {
    return this.http.get<CommentsI[]>(`${this.apiUrl}`);
  }

  getCommentById(id: number): Observable<CommentsI> {
    return this.http.get<CommentsI>(`${this.apiUrl}/${id}`);
  }

  createComment(comment: CommentsI, userId: number): Observable<CommentsI> {
    return this.http.post<CommentsI>(`${this.apiUrl}/${userId}`, comment);
  }

  updateComment(id: number, comment: CommentsI): Observable<CommentsI> {
    return this.http.put<CommentsI>(`${this.apiUrl}/${id}`, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
