import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsEmail, IsNotEmpty, IsDate } from "class-validator";

export class UserDto {
  @ApiProperty({
    description: "The unique identifier of the User",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: "The email address of the User", type: String })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "The password of the User", type: String })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: "The creation date of the User", type: Date })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: "The last update date of the User", type: Date })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  // Assuming Journal and UserSession are defined elsewhere
  // If you want to include the nested lists, you can define their DTOs and use them like this:
  // @ApiProperty({ type: [JournalDto] })
  // journalList: JournalDto[];

  // @ApiProperty({ type: [UserSessionDto] })
  // sessions: UserSessionDto[];

  constructor(
    id: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    // If using nested DTOs
    // journalList: JournalDto[],
    // sessions: UserSessionDto[],
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    // this.journalList = journalList;
    // this.sessions = sessions;
  }
}
