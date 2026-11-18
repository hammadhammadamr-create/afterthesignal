import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { AiAssistantService } from '../../../core/services/ai-assistant.service.ts';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

@Component({
  selector: 'app-ai-assistant',
  imports: [],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistant {
  private readonly aiService = inject(AiAssistantService);

  protected readonly isOpen = signal(false);
  protected readonly isLoading = signal(false);

  protected readonly messages = signal<ChatMessage[]>([
    {
      id: 1,
      text: 'Hello! Ask me anything about space or rovers like the Sojourner Rover.',
      sender: 'ai',
    },
  ]);

  private nextMessageId = 2;

  protected toggleChat(): void {
    this.isOpen.update((value) => !value);
  }

  protected sendMessage(question: string): void {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || this.isLoading()) return;

    this.messages.update((messages) => [
      ...messages,
      {
        id: this.nextMessageId++,
        text: trimmedQuestion,
        sender: 'user',
      },
    ]);

    this.isLoading.set(true);

    this.aiService.ask(trimmedQuestion).subscribe({
      next: (answer) => {
        this.messages.update((messages) => [
          ...messages,
          {
            id: this.nextMessageId++,
            text: answer,
            sender: 'ai',
          },
        ]);

        this.isLoading.set(false);
      },

      error: (error: unknown) => {
        console.error('AI request failed:', error);

        this.messages.update((messages) => [
          ...messages,
          {
            id: this.nextMessageId++,
            text: 'Sorry, I could not reach the AI server. Please try again.',
            sender: 'ai',
          },
        ]);

        this.isLoading.set(false);
      },
    });
  }
  private readonly messagesContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');

  constructor() {
    afterRenderEffect(() => {
      // Track messages changes
      this.messages();

      const container = this.messagesContainer()?.nativeElement;

      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
  protected handleInputKeydown(event: KeyboardEvent, input: HTMLTextAreaElement): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      this.sendMessage(input.value);
      input.value = '';
    }
  }
}
