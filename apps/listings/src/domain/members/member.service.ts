import { Member } from './member';

interface IMemberService {
  getMember(memberId: string): Member;
}

export class MemberService implements IMemberService {
  getMember(memberId: string): Member {
    throw new Error('Method not implemented.');
  }
}
