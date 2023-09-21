import { DomainEvents } from '@app/listings/src/infrastructure/domain-events';

import { QuestionAnswered } from '@app/listings/src/messages/events/QandA/question-answered.event';
import { QuestionSubmitted } from '@app/listings/src/messages/events/QandA/question-submitted.event';

import { Answer } from './answer';

export class Question {
  desc: string;
  answer: Answer;
  private sellerId: string;
  private publishOnListing: boolean;

  constructor(
    private id: string,
    private listingId: string,
    private memberId: string,
    question: string,
    private timeOfQuestion: Date,
  ) {
    this.desc = question;
    DomainEvents.raise(new QuestionSubmitted(this.id, this.listingId));
  }

  submitAnAnswer(
    answer: string,
    sellerId: string,
    publishOnListing: boolean,
    timeOfAnswer: Date,
  ): void {
    this.publishOnListing = publishOnListing;
    this.answer = new Answer(this.id, timeOfAnswer, answer);

    DomainEvents.raise(new QuestionAnswered(this.id, this.listingId));
  }
}
