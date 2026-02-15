import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Create complaint (citizen)
router.post("/", authMiddleware, upload.array("photos", 3), async (req, res) => {
  try {
    const photoPaths = req.files ? req.files.map(f => f.path) : [];
    const { title, description, locationText, department } = req.body;
    if (!title || !description || !locationText || !department)
      return res.status(400).json({ message: "Missing required fields" });

    const newComplaint = await Complaint.create({
      title, description, locationText, department,
      photos: photoPaths,
      authorId: req.user.id,
      upvotes: 1,
      upvoters: [req.user.id] // author auto counted
    });
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ message: "Error creating complaint", error: err.message });
  }
});

// My complaints (citizen)
router.get("/my", authMiddleware, async (req, res) => {
  const complaints = await Complaint.find({ authorId: req.user.id }).sort({ upvotes: -1 });
  res.json(complaints);
});

// All complaints for browsing (authenticated users) - can be filtered by dept
router.get("/all", authMiddleware, async (req, res) => {
  const filter = req.query.department ? { department: req.query.department } : {};
  const complaints = await Complaint.find(filter).sort({ upvotes: -1 });
  res.json(complaints);
});

// Upvote (authenticated user)
router.post("/:id/upvote", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint)
      return res.status(404).json({ message: "Not found" });

    // ❌ No upvote if resolved
    if (complaint.status === "Resolved") {
      return res.status(400).json({
        message: "Cannot upvote resolved complaints"
      });
    }

    // ❌ Author cannot upvote
    if (complaint.authorId.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot upvote your own complaint"
      });
    }

    // ❌ Already upvoted
    if (complaint.upvoters.includes(req.user.id)) {
      return res.status(400).json({
        message: "Already upvoted"
      });
    }

    complaint.upvotes += 1;
    complaint.upvoters.push(req.user.id);

    await complaint.save();

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", authMiddleware, authorizeRoles("authority"), async (req, res) => {
  try {
    const {
      status,
      area,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    // 🔥 Base filter for authorities
    const filter = {
      $and: [
        {
          $or: [
            { department: req.user.department },
            { department: "General" }
          ]
        },
        {
          status: { $nin: ["Resolved", "Rejected"] } // ❌ Hide resolved & rejected
        }
      ]
    };

    // ✅ Allow filtering ONLY allowed statuses
    if (status && !["Resolved", "Rejected"].includes(status)) {
      filter.$and.push({ status });
    }

    // 🔥 FIX AREA FILTER (CASE INSENSITIVE PARTIAL MATCH)
    if (area) {
      filter.$and.push({
        locationText: { $regex: area, $options: "i" }
      });
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    if (sort === "upvotes") {
      sortOption = { upvotes: -1 };
    } else if (sort === "date") {
      sortOption = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Authority: Update status + comment
router.put("/:id/status", authMiddleware, authorizeRoles("authority"), async (req, res) => {
  try {
    const { status, comment } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Not found" });

    if (status) {

      // ❌ Authority cannot reopen
      if (status === "Reopened") {
        return res.status(403).json({
          message: "Authorities cannot reopen complaints"
        });
      }

      // Validate status
      if (![
        "Submitted",
        "In Progress",
        "On Hold",
        "Resolved",
        "Rejected"
      ].includes(status))
        return res.status(400).json({ message: "Invalid status" });

      complaint.status = status;

      // If resolved → set resolvedAt
      if (status === "Resolved") {
        complaint.resolvedAt = new Date();
      }

      // If moved away from resolved → clear resolvedAt
      if (status !== "Resolved") {
        complaint.resolvedAt = null;
      }
    }

    if (comment) {
      complaint.authorityComments.push({
        by: req.user.id,
        comment
      });
    }

    await complaint.save();

    res.json(complaint);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Citizen: Reopen complaint
router.put("/:id/reopen", authMiddleware, authorizeRoles("citizen"), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    if (complaint.status !== "Resolved") {
      return res.status(400).json({
        message: "Only resolved complaints can be reopened"
      });
    }

    complaint.status = "Reopened";
    complaint.resolvedAt = null;

    await complaint.save();

    res.json({
      message: "Complaint reopened successfully",
      complaint
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
