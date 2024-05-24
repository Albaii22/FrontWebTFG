import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the interceptor
export class JwtInterceptor implements HttpInterceptor {
  // Intercept method to handle HTTP requests
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from local storage
    let token: string | null = localStorage.getItem("authToken");
    console.log(token);
    // Check if token is present and not empty
    if (token && token !== "") {
      // Clone the request and set authorization header with token
      req = req.clone({
        setHeaders: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    // Pass the modified request to the next handler
    return next.handle(req);
  }
}
