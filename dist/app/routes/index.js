"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const background_varification_routes_1 = require("../modules/background-varification/background-varification.routes");
const candidate_exam_routes_1 = require("../modules/candidate-exam/candidate-exam.routes");
const experience_letter_routes_1 = require("../modules/experience-letter/experience-letter.routes");
const generated_route_1 = require("../modules/generated-link/generated-route");
const guest_message_routes_1 = require("../modules/guest-message/guest-message.routes");
const offer_letter_routes_1 = require("../modules/offer-letter/offer-letter.routes");
const organization_routes_1 = require("../modules/organization/organization.routes");
const payslip_routes_1 = require("../modules/payslip/payslip.routes");
const release_letter_routes_1 = require("../modules/release-letter/release-letter.routes");
const user_routes_1 = require("../modules/user/user.routes");
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
    {
        path: "/guest-message",
        route: guest_message_routes_1.GuestMessageRoutes,
    },
    {
        path: "/background-varification",
        route: background_varification_routes_1.BackgroundVarificationRoutes,
    },
    {
        path: "/generated-link",
        route: generated_route_1.GeneratedLinkRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
