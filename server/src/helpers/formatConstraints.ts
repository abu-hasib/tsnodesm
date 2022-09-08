import { ValidationError } from "class-validator";

export const formatContraints = ({ constraints }: ValidationError) => {
  var propValue = "";
  for (var constraint in constraints) {
    if (constraints.hasOwnProperty(constraint)) {
      propValue = constraints[constraint];
    }
  }
  return propValue;
};
