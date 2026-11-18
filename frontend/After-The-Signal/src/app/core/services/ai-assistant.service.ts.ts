import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';

interface AskAiRequest {
  question: string;
}

interface AskAiResponse {
  answer?: string;
  response?: string;
  message?: string;
}

@Service({})
export class AiAssistantService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://afterthesignal.runasp.net/api/Ai/ask';

  ask(question: string): Observable<string> {
    const payload: AskAiRequest = { question };

    return this.http
      .post<AskAiResponse>(this.apiUrl, payload)
      .pipe(
        map(
          (data) =>
            data.answer ?? data.response ?? data.message ?? 'The AI returned an empty response.',
        ),
      );
  }
}
