import { IsEmail, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";
@InputType()
export class UserValidator {
  static errors() {
    console.log("Am static.....");
  }

  @Field()
  @IsEmail()
  public email: string;

  @Field()
  @IsString()
  password: string;

  @Field()
  @IsString()
  username: string;
}

@InputType()
export class UserValidate {
  @Field()
  public email: string;

  @Field()
  public username: string;

  @Field()
  password: string;
}
