import { InputType } from "../defintion/types/InputType";
import { ObjectType } from "../defintion/types/ObjectType";
import { InterfaceType } from "../defintion/types/InterfaceType";
import { InstanceOf } from "../../shared/InstanceOf";
import { Field } from "../defintion/fields/Field";
import { ObjectField } from "../defintion/fields/ObjectField";
import { InputField } from "../defintion/fields/InputField";

export type ConversionType =
  | typeof InputType
  | typeof ObjectType
  | typeof InterfaceType;

export class TypeConverter {
  static convert<Target extends ConversionType>(
    typeDefinition: InputType | ObjectType | InterfaceType,
    target: Target,
  ): InstanceOf<Target> {
    const newTypeDef = target.create(typeDefinition.name) as InstanceOf<Target>;
    let newFields: Field[];

    // Input => Interface / Object
    if (this instanceof InputType && target !== InputType) {
      const inputFields: ObjectField[] = (this.fields as InputField[]).map(
        (f) => {
          return ObjectField.create(f.name, f.type)
            .setDescription(f.description)
            .setDeprecationReason(f.deprecationReason);
        },
      );
      newFields = inputFields;
    }
    // Object / Interface => Input
    else if (!(this instanceof InputType) && target === InputType) {
      const objectFields: InputField[] = (typeDefinition.fields as ObjectField[]).reduce(
        (prev, f) => {
          if (!f.resolve) {
            prev.push(
              InputField.create(f.name, f.type)
                .setDescription(f.description)
                .setDeprecationReason(f.deprecationReason),
            );
          }
          return prev;
        },
        [],
      );
      newFields = objectFields;
    }
    // Object / Interface => Object / Interface OR Input => Input
    else {
      newFields = typeDefinition.fields;
    }

    newTypeDef.addFields(...newFields);

    return newTypeDef;
  }
}
