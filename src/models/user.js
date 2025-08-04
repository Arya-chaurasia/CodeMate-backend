const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid email address" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is default description"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

//userSchema.index({ firstName: 1 })

userSchema.methods.getJWT = async function () {
    const user = this
      const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
}
const User = mongoose.model("User", userSchema);

module.exports = User;