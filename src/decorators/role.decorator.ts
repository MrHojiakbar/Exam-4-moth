import { SetMetadata } from "@nestjs/common"

export const ROLE_KEY='role'

export const Roles=(possibleRoles:string[])=>SetMetadata(ROLE_KEY,possibleRoles)