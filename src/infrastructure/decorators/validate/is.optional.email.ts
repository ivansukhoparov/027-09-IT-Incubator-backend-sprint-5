import { applyDecorators } from '@nestjs/common';
import { Trim } from '../transform/trim';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export const IsOptionalEmail = () => {
  return applyDecorators(Trim(), IsString(), IsNotEmpty(), IsEmail());
};
