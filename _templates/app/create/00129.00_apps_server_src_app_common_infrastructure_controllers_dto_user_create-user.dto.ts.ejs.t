---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/controllers/dto/user/create-user.dto.ts`) %>
unless_exists: true
---
import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BODYCreateUserDTO {
  @IsInt()
  @Min(1)
  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
    default: 1,
    description: 'User ID value',
  })
  public readonly id: number;

  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Alice',
    default: 'Alice',
    description: 'User name',
  })
  public readonly name: string;

  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: 'alice@example.com',
    default: 'alice@example.com',
    description: 'User email',
  })
  public readonly email: string;
}
