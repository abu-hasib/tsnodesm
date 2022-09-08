"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatContraints = void 0;
const formatContraints = ({ constraints }) => {
    var propValue = "";
    for (var constraint in constraints) {
        if (constraints.hasOwnProperty(constraint)) {
            propValue = constraints[constraint];
        }
    }
    return propValue;
};
exports.formatContraints = formatContraints;
//# sourceMappingURL=formatConstraints.js.map