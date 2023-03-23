import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user.dto';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: UserDto): Promise<UserDto> {
    const errors: ValidationError[] = await validate(user);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const saltOrRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(
      user.password,
      saltOrRounds,
    );
    const newUser: UserDto = { ...user, password: hashedPassword };

    const userEntity: UserEntity = await this.userRepository.save(
      plainToInstance(UserEntity, newUser),
    );

    console.log(userEntity);

    return plainToInstance(UserDto, userEntity);
  }

  async findByEmail(email: string): Promise<UserDto> {
    const userEntity: UserEntity = await this.userRepository.findOne({
      where: { email },
    });

    if (!userEntity) {
      throw new Error(`${email} not found`);
    }
    return plainToInstance(UserDto, userEntity);
  }

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user: UserDto = await this.findByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}
