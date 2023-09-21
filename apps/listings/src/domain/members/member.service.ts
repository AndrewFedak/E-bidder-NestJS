import { Member } from './member';

export interface IMemberService {
  getMember(memberId: string): Member;
}
