import { MinLength } from 'class-validator';

export class ChatroomSearchDto {
  @MinLength(1)
  term: string;
}
