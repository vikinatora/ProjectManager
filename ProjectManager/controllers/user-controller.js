const encryption = require('../util/encryption');
const User = require('mongoose').model('User');
const defaultPicture = 'http://static.newworldencyclopedia.org/thumb/3/3a/Cat03.jpg/200px-Cat03.jpg';
const Project = require('../models/Project');
const Team = require('../models/Team');

module.exports = {
    registerGet: (req, res) => {
        res.render('users/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;
        const salt = encryption.generateSalt();
        const hashedPass =
            encryption.generateHashedPassword(salt, reqUser.password);
        try {
            debugger;
            if(reqUser.profilePicture==="") {
                reqUser.profilePicture = defaultPicture;
            }
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                profilePicture:reqUser.profilePicture,
                roles: ['User'],
            });
            req.logIn(user, (err, user) => {
                if (err) {
                    res.locals.globalError = err;
                    res.render('users/register', user);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/register');
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('users/login');
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;
        try {
            const user = await User.findOne({ username: reqUser.username });
            if (!user) {
                errorHandler('Invalid user data');
                return;
            }
            if (!user.authenticate(reqUser.password)) {
                errorHandler('Invalid user data');
                return;
            }
            req.logIn(user, (err, user) => {
                if (err) {
                    errorHandler(err);
                } else {
                    res.redirect('/');
                }
            });
        } catch (e) {
            errorHandler(e);
        }

        function errorHandler(e) {
            console.log(e);
            res.locals.globalError = e;
            res.render('users/login');
        }
    },
    
    profile: async (req,res)=>{
        let user = await User.findById(req.user._id)
            let projects =[];
            let teams = [];

            user.hasTeam = true;
            user.hasProjects = true;
            debugger;
            if(!user.teams.length) {
                user.hasTeam = false;
                user.hasProjects = false;
                res.render('users/profile',{user});
                return;
            }
            else {

                for (const team of user.teams) {
                    let newTeam = await Team.findById(team);
                    let project = await Project.findOne({team});
                    if(project){
                        projects.push(project);
                    }
                    teams.push(newTeam);
                }
                debugger;
                user.newTeams = teams;
                if(projects.length ===0) {
                    user.hasProjects = false;
                    res.render('users/profile',{user})
                    return;
                } else {
                    user.newProjects = projects;
                    res.render('users/profile',{user})
                    return;

                }
            }
    },
    leaveTeam: async(req,res)=>{
        let teamId = req.params.id;
        let userId = req.user.id;

        let team = await Team.findById(teamId);
        team.members.pop(userId);
        req.user.teams.pop(teamId);
        await team.save();
        await req.user.save();

        res.redirect('/user/profile');
    }
};