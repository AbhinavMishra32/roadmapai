"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/chatavailable', async (req, res) => {
    try {
        const studentsChatting = await db_1.default.student.findMany({
            where: {
                chats: {
                    some: {
                        counsellorId: req.addedUser.id
                    }
                }
            },
            include: {
                chats: {
                    where: {
                        counsellorId: req.addedUser.id
                    }
                }
            }
            // include: {
            //     chats: {
            //         where: {
            //             counsellorId: req.addedUser.id
            //         }
            //     }
            // }
        });
        if (!studentsChatting) {
            return res.status(404).json({
                success: false,
                message: "No students are chatting with you"
            });
        }
        return res.status(200).json({
            success: true,
            studentsChatting,
        });
    }
    catch (error) {
        console.log("Error in student router GET /chatavailable : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const student = await db_1.default.student.findUnique({
            where: {
                id: req.params.id
            }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }
        return res.status(200).json({
            success: true,
            student
        });
    }
    catch (error) {
        console.log("Error in student router GET /:id : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R1ZGVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvc3R1ZGVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFDQUEyQztBQUUzQywrQ0FBMkI7QUFFM0IsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsR0FBZ0IsRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUNuRSxJQUFJLENBQUM7UUFDRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sWUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDbkQsS0FBSyxFQUFFO2dCQUNILEtBQUssRUFBRTtvQkFDSCxJQUFJLEVBQUU7d0JBQ0YsWUFBWSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRTtxQkFDakM7aUJBQ0o7YUFDSjtZQUNELE9BQU8sRUFBRTtnQkFDTCxLQUFLLEVBQUU7b0JBQ0gsS0FBSyxFQUFFO3dCQUNILFlBQVksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUU7cUJBQ2pDO2lCQUNKO2FBQ0o7WUFDRCxhQUFhO1lBQ2IsZUFBZTtZQUNmLG1CQUFtQjtZQUNuQiw2Q0FBNkM7WUFDN0MsWUFBWTtZQUNaLFFBQVE7WUFDUixJQUFJO1NBQ1AsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFDcEIsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLG1DQUFtQzthQUMvQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN4QixPQUFPLEVBQUUsSUFBSTtZQUNiLGdCQUFnQjtTQUNuQixDQUFDLENBQUM7SUFFUCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0NBQStDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFcEUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDakIsT0FBTyxFQUFFLEtBQUs7WUFDZCxPQUFPLEVBQUUsdUJBQXVCO1NBQ25DLENBQUMsQ0FBQztJQUNQLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUdILE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFnQixFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQ3pELElBQUksQ0FBQztRQUNELE1BQU0sT0FBTyxHQUFHLE1BQU0sWUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDNUMsS0FBSyxFQUFFO2dCQUNILEVBQUUsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUU7YUFDcEI7U0FDSixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDWCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN4QixPQUFPLEVBQUUsS0FBSztnQkFDZCxPQUFPLEVBQUUsbUJBQW1CO2FBQy9CLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3hCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTztTQUNWLENBQUMsQ0FBQztJQUVQLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUxRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqQixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSx1QkFBdUI7U0FDbkMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsTUFBTSxDQUFDIn0=