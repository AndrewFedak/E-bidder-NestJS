import { Member } from './member';

interface IMemberService {
  getMember(memberId: string): Promise<Member>;
}

export class MemberService implements IMemberService {
  async getMember(memberId: string): Promise<Member> {
    throw new Error('Method not implemented.');
  }
}
