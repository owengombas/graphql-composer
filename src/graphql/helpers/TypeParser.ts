import {
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInputType,
} from "graphql";
import { FieldType } from "../types/FieldType";
import { NotNullableType } from "../defintion/modifiers/NotNullable";
import { Type } from "../defintion/types/Type";

export class TypeParser {
  static parse<ReturnType>(type: FieldType): ReturnType {
    let finalType: GraphQLOutputType | GraphQLInputType;

    if (type instanceof NotNullableType) {
      finalType = GraphQLNonNull(this.parse(type.type));
    }

    if (Array.isArray(type)) {
      finalType = this.parse(type[0]);
      finalType = GraphQLList(finalType);
    }

    if (type instanceof Type) {
      finalType = type.built;
    }

    switch (type) {
      case String:
        finalType = GraphQLString;
        break;
      case Number:
        finalType = GraphQLFloat;
        break;
      case Boolean:
        finalType = GraphQLBoolean;
        break;
    }

    return finalType as any;
  }
}
