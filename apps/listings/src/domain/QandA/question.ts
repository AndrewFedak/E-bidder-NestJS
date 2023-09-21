import { Answer } from './answer';

import { QuestionAnswered } from './question-answered.event';
import { QuestionSubmitted } from './question-submitted.event';

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
    DomainEvents.Raise(new QuestionSubmitted(this.id, this.listingId));
  }

  submitAnAnswer(
    answer: string,
    sellerId: string,
    publishOnListing: boolean,
    timeOfAnswer: Date,
  ): void {
    this.publishOnListing = publishOnListing;
    this.answer = new Answer(timeOfAnswer, answer);

    DomainEvents.Raise(new QuestionAnswered(this.id, this.listingId));
  }
}
