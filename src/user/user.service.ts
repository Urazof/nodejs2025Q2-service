import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { login } });
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const now = Date.now();
    const salt = parseInt(process.env.CRYPT_SALT, 10) || 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = this.userRepository.create({
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    const savedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const salt = parseInt(process.env.CRYPT_SALT, 10) || 10;
    user.password = await bcrypt.hash(updatePasswordDto.newPassword, salt);

    user.version += 1;
    user.updatedAt = Date.now();
    const updatedUser = await this.userRepository.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.remove(user);
  }
}
