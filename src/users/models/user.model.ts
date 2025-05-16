import { Column, DataType, Model, Table } from "sequelize-typescript";
import { UserRoles } from "../enums";

@Table({tableName:"users"})
export class User extends Model {
    @Column({type:DataType.STRING})
    name:string;

    @Column({type:DataType.STRING,unique:true})
    email:string;

    @Column({type:DataType.STRING})
    password:string;

    @Column({type:DataType.STRING,defaultValue:UserRoles.USER})
    role:string;
}