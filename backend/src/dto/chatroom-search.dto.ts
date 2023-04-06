import { MinLength } from 'class-validator';

export class ChatroomSearchDto {
  @MinLength(3)
  term: string;
}
