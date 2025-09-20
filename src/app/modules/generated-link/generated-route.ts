import { Request, Response, Router } from "express";
import GeneratedLink from "./generated-link.model";
const router = Router();

router.post(
  "/generate-background-verification-url/:employeeId",
  async (req: Request, res: Response) => {
    try {
      const { employeeId } = req.params;
      const now = new Date();

      // Check if there's already a valid (non-expired) link for this employee
      let existingLink = await GeneratedLink.findOne({
        employeeId,
        expiresAt: { $gt: now }, // Not expired yet
      });

      if (existingLink) {
        // Return the existing valid link
        return res.json({
          message: "Existing valid link found.",
          expiresAt: existingLink.expiresAt,
        });
      }

      // No valid link found, so create a new one for 7 days
      //   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // No valid link found, so create a new one for 10 minute
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const newGeneratedLink = new GeneratedLink({
        employeeId,
        expiresAt,
      });

      await newGeneratedLink.save();

      return res.json({
        message: "Generated new link successfully.",
        expiresAt: newGeneratedLink.expiresAt,
      });
    } catch (error) {
      console.error("Error generating background verification link:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

export const GeneratedLinkRoutes = router;
