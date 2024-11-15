import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BookEntity } from './book.entity';
import { IBook } from '@domain/interfaces/book.interface';

@Entity('author')
export class AuthorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => BookEntity, (book) => book.author)
  books: IBook[];
}