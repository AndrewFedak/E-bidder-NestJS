import { v4 as uuid } from 'uuid';

import { Entity } from '@app/listings/src/infrastructure/entity';

import { ListingFormat } from './listing-format';
import { WatchedItem } from '@app/listings/src/domain/watch-list/watched-item';
import { Question } from '@app/listings/src/domain/QandA/question';

export class Listing extends Entity<string> {
  private format: ListingFormat;
  private title: string;
  private description: string;
  private condition: string;
  private sellerId: string;

  private postageCosts: number;

  private paymentMethodsAccepted: string;
  private dispatchTime: string;

  constructor(id: string, sellerId: string, format: ListingFormat) {
    super();
    this.id = id;
    this.sellerId = sellerId;
    this.format = format;
  }

  //public Email ContactSeller(string question)
  //{
  // You'll receive the message in your Messages inbox and your personal email account.
  // When you respond, you can choose to post the question and answer to your listing
  // so all buyers can see it. Once you post the answer, you can't change or remove it.
  //}

  watch(watchedItemId: string, memberId: string): WatchedItem {
    return new WatchedItem(watchedItemId, this.id, memberId);
  }

  //public void Add(PaymentMethod paymentMethod)
  //{
  // replace Item and add PaymentMethod
  //}

  //public void Add(PostLocation()
  //{

  //}

  askQuestion(
    memberId: string,
    quesiton: string,
    timeOfQuestion: Date,
  ): Question {
    return new Question(uuid(), this.id, memberId, quesiton, timeOfQuestion);
  }

  // public void Amend(Item item)
  // {
  // http://pages.ebay.co.uk/help/sell/revising_restrictions.html
  // if (currentTime.
  // Throw New ItemRevisionEvent(Description), DateTime currentTime
  //  }
}
