import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import UserValidator from "../contracts/validators/user.validator";
import { Field, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Unique()
  @IsEmail()
  @IsNotEmpty()
  @Property()
  email: string;

  @Property()
  @MinLength(3, {
    message: "Password is too short",
  })
  password: string;

  constructor(body: UserValidator) {
    this.email = body.email;
    this.password = body.password;
  }
}
