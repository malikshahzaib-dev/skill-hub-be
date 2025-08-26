import mongoose, { model, Schema, Types, Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  description: string;
  status: "pending" | "approved" | "blocked";
  createdBy: Types.ObjectId;
  contactEmail: string;
  website?: string;
  phone?: string;
  address?: string;
  industry?: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "blocked","unblocked"],
      default: "pending",   
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    contactEmail: { type: String, required: true },
    website: { type: String },
    phone: { type: String },
    address: { type: String },
    industry: { type: String },
  },
  { timestamps: true }
);

const Organization = mongoose.model<IOrganization>(
  "Organization",
  organizationSchema
);

export default Organization;
