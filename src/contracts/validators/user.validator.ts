import { IsEmail, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";
@InputType()
class UserValidator {
  static errors() {
    console.log("Am static.....");
  }

  @Field()
  @IsEmail()
  public email: string;

  @Field()
  @IsString()
  password: string;
}

export default UserValidator;
