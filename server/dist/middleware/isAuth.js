"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = ({ context }, next) => {
    if (!context.req.session.userId)
        throw new Error("not authenticated");
    else
        return next();
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map