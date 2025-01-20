"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const router = (0, express_1.Router)();
router.get("/", user_controller_1.fetchUser);
router.get('/extended', user_controller_1.fetchExtendedUser);
router.post('/onboard', user_controller_1.onboardUser);
router.post('/onboard/recruiter', user_controller_1.recruiterOnboard);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvdXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxtRUFBNEc7QUFFNUcsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFDeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsMkJBQVMsQ0FBQyxDQUFDO0FBQzNCLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLG1DQUFpQixDQUFDLENBQUM7QUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsNkJBQVcsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsa0NBQWdCLENBQUMsQ0FBQztBQUVwRCxrQkFBZSxNQUFNLENBQUMifQ==