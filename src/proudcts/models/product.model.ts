import { Column, DataType, Model, Table } from "sequelize-typescript";
import { StatusEnum } from "../enums";

@Table({tableName:"products"})

export class Products extends Model {
    @Column({type:DataType.STRING})
    name:string;

    @Column({type:DataType.STRING})
    description:string;

    @Column({type:DataType.DECIMAL(10,3)})
    price:number;

    @Column({type:DataType.DECIMAL(5,2)})
    discount:number;

    @Column({type:DataType.DECIMAL(2,1)})
    rating:number;

    @Column({type:DataType.INTEGER})
    stock:number;

    @Column({type:DataType.STRING,defaultValue:StatusEnum.active})
    status:StatusEnum

    @Column({type:DataType.INTEGER})
    userId:number;

    @Column({type:DataType.ARRAY(DataType.STRING)})
    images_url:string[]
}