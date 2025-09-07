"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const offer_letter_routes_1 = require("../modules/offer-letter/offer-letter.routes");
const payslip_routes_1 = require("../modules/payslip/payslip.routes");
const candidate_exam_routes_1 = require("../modules/candidate-exam/candidate-exam.routes");
const organization_routes_1 = require("../modules/organization/organization.routes");
const release_letter_routes_1 = require("../modules/release-letter/release-letter.routes");
const experience_letter_routes_1 = require("../modules/experience-letter/experience-letter.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/offer-letter",
        route: offer_letter_routes_1.OfferLetterRoutes,
    },
    {
        path: "/payslip",
        route: payslip_routes_1.PayslipLetterRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/candidate-exam",
        route: candidate_exam_routes_1.CandidateExamRoutes,
    },
    {
        path: "/organization",
        route: organization_routes_1.OrganizationRoutes,
    },
    {
        path: "/release-letter",
        route: release_letter_routes_1.ReleaseLetterRoutes,
    },
    {
        path: "/experience-letter",
        route: experience_letter_routes_1.ExperienceLetterRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
