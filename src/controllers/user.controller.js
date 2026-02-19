import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import uploadCloudinary from "../utils/clouDinary.js";
import ApiResponce from "../utils/ApiResponce.js";
const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;
    if ([userName, email, fullName, password].some(field => !field || field.trim() === "")) throw new ApiError(400, "All fields is required");

    const exitedUser = await User.findOne({ $or: [{ userName }, { email }] });

    if (exitedUser) throw new ApiError(409, "User already exist");

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadCloudinary(avatarLocalPath);

    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadCloudinary(coverImageLocalPath);
    }

    const user = await User.create({
        userName: userName.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || ""
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "something went wrong whild registering user");

    return res.status(201).json(new ApiResponce(200, "User created successfully", createdUser));



});

export { registerUser };
