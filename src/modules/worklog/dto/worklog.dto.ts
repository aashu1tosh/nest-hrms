import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsNotBlank } from 'src/common/dto/is-not-blank.dto';

export class CreateWorklogDTO {
  @IsNotEmpty()
  @IsNotBlank()
  tasksCompleted: string;

  @IsOptional()
  @IsString()
  tasksInProgress: string;

  @IsOptional()
  @IsString()
  challengesFaced: string;

  @IsNotEmpty()
  @IsNotBlank()
  plannedTasksForTomorrow: string;

  @IsOptional()
  @IsString()
  remarks: string;
}

export class UpdateWorklogDTO extends PartialType(CreateWorklogDTO) {}
