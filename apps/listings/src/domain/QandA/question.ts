import { DomainEvents } from '../../infrastructure/domain-events';
import { Answer } from './answer';

import { QuestionAnswered } from 'apps/listings/src/cqrs/events/QandA/question-answered.event';
import { QuestionSubmitted } from 'apps/listings/src/cqrs/events/QandA/question-submitted.event';

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
