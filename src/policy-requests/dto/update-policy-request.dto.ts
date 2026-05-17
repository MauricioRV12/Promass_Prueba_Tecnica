import { IsNumber, IsString } from "class-validator";
import { CreatePolicyRequestDto } from "./create-policy-request.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdatePolicyRequestDto extends PartialType (CreatePolicyRequestDto) {}