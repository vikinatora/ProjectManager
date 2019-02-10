const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const defaultPicture = 'http://static.newworldencyclopedia.org/thumb/3/3a/Cat03.jpg/200px-Cat03.jpg';

const userSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.String, required: true, unique: true },
    hashedPass: { type: mongoose.Schema.Types.String, required: true },
    firstName: { type: mongoose.Schema.Types.String, required: true },
    lastName: { type: mongoose.Schema.Types.String, required: true },
    profilePicture:{type:mongoose.Schema.Types.String, default:defaultPicture},
    teams: [{ type: mongoose.Schema.Types.String }],
    roles: [{ type: mongoose.Schema.Types.String }],
    salt: { type: mongoose.Schema.Types.String, required: true },
});

userSchema.method({
    authenticate: function (password) {
        return encryption.generateHashedPassword(this.salt, password) === this.hashedPass;
    }
});

const User = mongoose.model('User', userSchema);

User.seedAdminUser = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateHashedPassword(salt, 'Admin');
        return User.create({
            username: 'Admin',
            firstName:'admin',
            lastName:'adminov',
            salt,
            hashedPass,
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = User;
