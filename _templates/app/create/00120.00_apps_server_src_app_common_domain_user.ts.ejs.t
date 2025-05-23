---
to: <%= h.server(!CUT_EXAMPLES && `${ROOT}/apps/${SERVER_NAME}/src/app/common/domain/user.ts`) %>
unless_exists: true
---
import { AutoObject, Getter, ValueObject } from '@biorate/auto-object';
import { IsInt, IsNumber, IsString, IsObject, IsOptional } from 'class-validator';

class UserAddress extends AutoObject<UserAddress> {
  @IsString()
  @IsOptional()
  public city: string;

  @IsString()
  @IsOptional()
  public street: string;

  @IsNumber()
  @IsOptional()
  public apartment: number;

  @IsNumber()
  @IsOptional()
  public postal: number;

  public get inline() {
    return <Getter<string>>(
      `${this.postal}, ${this.city}, ${this.street} №${this.apartment}`
    );
  }
}

export class User extends AutoObject<User> {
  @IsInt()
  public id: number;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public email?: string;

  @IsObject()
  @IsOptional()
  @ValueObject(UserAddress)
  public address?: UserAddress;
}
