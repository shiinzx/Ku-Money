import mongoose from "mongoose";
const UserAccessSchema = new mongoose.Schema({
 user: {
 _id: {
 type: ObjectId,
 ref: User,
 required: true
 },
 email: {
 type: String,
 required: true
 }
 },
 refreshToken: {
 type: String,
 required: true,
 unique: true
 },
 createdAt: {
 type: Date
 },
 updatedAt: {
 type: Date
 }
});
const UsserAcces = mongoose.model('Useer', useerSchema);

export default User;