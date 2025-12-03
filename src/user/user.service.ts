import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Omit<User, 'password'>[] {
    return this.db.users.map(({ password, ...user }) => user);
  }

  findOne(id: string): Omit<User, 'password'> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    const now = Date.now();
    const user: User = {
      id: randomUUID(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.db.users.push(user);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  remove(id: string): void {
    const index = this.db.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.db.users.splice(index, 1);
  }
}
