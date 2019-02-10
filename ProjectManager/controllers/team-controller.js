const Team = require('../models/Team');
const User = require('../models/User');

module.exports = {
    createGet: (req, res) => {
        res.render('teams/create');
    },
    createPost: (req, res) => {
        let name = req.body.name;
        Team.create({name})
            .then((team)=>{
                res.redirect('/');
            });
    },
    distributeGet: async (req, res) => {
        let users = await User.find();
        let teams = await Team.find();
        res.render('teams/distribute',{users,teams});
    },
    distributePost:async (req, res) => {
        debugger;
        let{userId,teamId} = req.body;
        let team = await Team.findById(teamId);
        if(team.members.indexOf(userId)!==-1){
            console.log("Cannot add the same person twice! :@");
            res.locals.globalError = "Cannot add the same person twice! :@";
            res.redirect('/');

        } else {
            let user = await User.findById(userId);
            user.teams.push(teamId);
            await user.save()
            team.members.push(userId);
            await team.save();
            res.redirect('/');
        }
    },
    allTeams: async (req,res)=>{
        let teams = await Team.find()
            .populate('projects')
            .populate('members');
        teams.forEach(team => {
            team.hasMembers = true;
            team.hasProjects = true;
            debugger;
            if(!team.members.length){
                debugger;
                team.hasMembers = false;
            }
            if(!team.projects.length) {
                debugger;
                team.hasProjects = false;
            }
        });

            res.render('teams/all-teams',{teams});

    },
    searchTeams: async (req,res)=>{
        let query = req.query.searchQuery;
        
        let teams = await Team.find()
            .populate('projects')
            .populate('members');
        const filteredTeams = teams.filter((p)=>{
            return p.name.toLowerCase().includes(query.toLowerCase())
        });

        filteredTeams.forEach(team => {
            team.hasMembers = true;
            team.hasProjects = true;
            debugger;
            if(!team.members.length){
                debugger;
                team.hasMembers = false;
            }
            if(!team.projects.length) {
                debugger;
                team.hasProjects = false;
            }
        });

            res.render('teams/all-teams',{teams:filteredTeams});

    },

};