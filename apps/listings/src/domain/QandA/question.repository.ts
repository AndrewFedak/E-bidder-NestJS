import { Question } from './question';

export interface IQuestionRepository {
  findBy(id: string): Question;
  add(question: Question): void;
}
