import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BackgroundVarificationRoutes } from "../modules/background-varification/background-varification.routes";
import { CandidateExamRoutes } from "../modules/candidate-exam/candidate-exam.routes";
import { ExperienceLetterRoutes } from "../modules/experience-letter/experience-letter.routes";
import { GeneratedLinkRoutes } from "../modules/generated-link/generated-route";
import { GuestMessageRoutes } from "../modules/guest-message/guest-message.routes";
import { OfferLetterRoutes } from "../modules/offer-letter/offer-letter.routes";
import { OrganizationRoutes } from "../modules/organization/organization.routes";
import { PayslipLetterRoutes } from "../modules/payslip/payslip.routes";
import { ReleaseLetterRoutes } from "../modules/release-letter/release-letter.routes";
import { UserRoutes } from "../modules/user/user.routes";
const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/offer-letter",
    route: OfferLetterRoutes,
  },
  {
    path: "/payslip",
    route: PayslipLetterRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/candidate-exam",
    route: CandidateExamRoutes,
  },
  {
    path: "/organization",
    route: OrganizationRoutes,
  },
  {
    path: "/release-letter",
    route: ReleaseLetterRoutes,
  },
  {
    path: "/experience-letter",
    route: ExperienceLetterRoutes,
  },
   {
    path: "/guest-message",
    route: GuestMessageRoutes,
  },
  {
    path: "/background-varification",
    route: BackgroundVarificationRoutes,
  },
  {
    path: "/generated-link",
    route: GeneratedLinkRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
