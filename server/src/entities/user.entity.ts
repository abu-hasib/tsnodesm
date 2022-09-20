import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { IsEmail, IsNotEmpty, MinLength, NotContains } from "class-validator";
import { UserValidate } from "../contracts/validators/user.validator";

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

  @Field()
  @Unique()
  @MinLength(3, {
    message: "Username is too short",
  })
  @Property()
  @NotContains("@")
  username: string;

  @IsNotEmpty()
  @MinLength(3, {
    message: "Password is too short",
  })
  @Property()
  password: string;

  constructor(body: UserValidate) {
    this.email = body.email;
    this.password = body.password;
    this.username = body.username;
  }
}
