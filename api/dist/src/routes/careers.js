"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const careers_controller_1 = require("../controller/careers.controller");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const careers = await db_1.default.careerCategory.findMany({
        include: {
            careers: true
        }
    });
    res.status(200).json({
        success: true,
        message: "Careers fetched successfully",
        careers,
    });
});
router.get('/:onetCode', careers_controller_1.fetchOnetData);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZWVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY2FyZWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHFDQUFpQztBQUNqQywrQ0FBMkI7QUFDM0IseUVBQWlFO0FBRWpFLE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBQ3hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDbEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxZQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FDaEQ7UUFDSSxPQUFPLEVBQUU7WUFDTCxPQUFPLEVBQUUsSUFBSTtTQUNoQjtLQUNKLENBQ0osQ0FBQztJQUVGLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2pCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsT0FBTyxFQUFFLDhCQUE4QjtRQUN2QyxPQUFPO0tBQ1YsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxrQ0FBYSxDQUFDLENBQUM7QUFHeEMsa0JBQWUsTUFBTSxDQUFDIn0=