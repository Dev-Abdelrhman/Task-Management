const mongoose = require("mongoose");
const Task = require("./task.Model");
const Comment = require("./comment.Model");
const Role = require("./role.Model");
const Invite = require("./invite.Model");
const slugify = require("slugify");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "Other",
      enum: [
        "UI/UX",
        "Development",
        "Marketing",
        "Product Management",
        "Business Strategy",
        "Operations",
        "Sales",
        "Customer Support",
        "Finance",
        "Legal",
        "Human Resources",
        "IT Support",
        "Research & Development",
        "Data Science",
        "Machine Learning",
        "Artificial Intelligence",
        "Cybersecurity",
        "Blockchain",
        "E-commerce",
        "Supply Chain",
        "Logistics",
        "Event Management",
        "Healthcare",
        "Real Estate",
        "Education",
        "Non-Profit",
        "Construction",
        "Retail",
        "Entertainment",
        "Media & Publishing",
        "Public Relations",
        "Government",
        "Telecommunications",
        "Design",
        "Consulting",
        "Travel & Hospitality",
        "Frontend Development",
        "Backend Development",
        "Fullstack Development",
        "Quality Assurance",
        "Testing",
        "Bug Fixing",
        "DevOps",
        "Continuous Integration",
        "Deployment",
        "Cloud Computing",
        "AWS",
        "Google Cloud",
        "Azure",
        "Augmented Reality",
        "Virtual Reality",
        "AR/VR Development",
        "Internet of Things",
        "IoT Development",
        "Smart Devices",
        "Automation",
        "Robotic Process Automation (RPA)",
        "CRM Development",
        "Customer Insights",
        "CRM Integration",
        "ERP Development",
        "Enterprise Solutions",
        "Business Systems",
        "Game Development",
        "Unity Development",
        "Unreal Engine",
        "AI Ethics",
        "Ethical AI",
        "AI Regulations",
        "Other",
      ],
    },
    image: [
      {
        public_id: String,
        url: String,
        original_filename: String,
        format: String,
      },
    ],
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
          default: "6809485ed8757a1e7b77679a",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

projectSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name + Date.now() + this.description, {
      lower: true,
      strict: true,
    });
  }
  next();
});

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: "members.user",
    select: "name image _id",
  });
  next();
});

projectSchema.virtual("memberCount").get(function () {
  return this.members.length;
});

projectSchema.virtual("type").get(function () {
  return this.memberCount > 1 ? "Public" : "Private";
});

projectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
});

projectSchema.virtual("progress").get(function () {
  if (!this.tasks || !this.tasks.length) return 0;
  const totalTasks = this.tasks.length;
  const completedTasks = this.tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  return Math.round((completedTasks / totalTasks) * 100);
});

projectSchema.virtual("status").get(function () {
  if (this.progress === 100) {
    return "Completed";
  } else if (this.progress < 100) {
    return "In Progress";
  } else if (this.dueDate < Date.now()) {
    return "Overdue";
  }
});

projectSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const projectId = this._id;

    await Comment.deleteMany({ project: projectId });
    await Task.deleteMany({ project: projectId });
    await Role.deleteMany({ project: projectId });
    await Invite.deleteMany({ project: projectId });

    next();
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
