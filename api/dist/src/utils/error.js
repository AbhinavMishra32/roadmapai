"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (statusCode, message, err) => {
    console.log("Error:", err);
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    console.log("Error occured:", error.message);
    return error;
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSU8sTUFBTSxZQUFZLEdBQUcsQ0FBQyxVQUFrQixFQUFFLE9BQWUsRUFBRSxHQUFZLEVBQWdCLEVBQUU7SUFDNUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0IsTUFBTSxLQUFLLEdBQWdCLElBQUksS0FBSyxFQUFpQixDQUFDO0lBQ3RELEtBQUssQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzlCLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQTtBQVBZLFFBQUEsWUFBWSxnQkFPeEIifQ==