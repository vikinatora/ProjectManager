const Project = require('../models/Project');
const Team = require('../models/Team');
module.exports = {
    createGet: (req, res) => {
        res.render('projects/create');
    },
    createPost: (req, res) => {
        let {name,description} = req.body;
        Project.create({name,description})
            .then((project)=>{
                res.redirect('/');
            });
    },
    distributeGet: async (req, res) => {
        debugger;
        let projects = await Project.find({team:undefined});

        let teams = await Team.find();

        res.render('projects/distribute',{teams,projects});
    },
    distributePost:async  (req, res) => {
        let {teamId,projectId} = req.body;
        let team = await Team.findById(teamId);
        let project = await Project.findById(projectId);

        team.projects.push(projectId);
        project.team = teamId;

        await team.save();
        await project.save();

        res.redirect('/');
    },
    allProjects: async (req,res)=>{
        let projects = await Project.find()
            .populate('team');
            projects.forEach(project => {
                project.hasTeam = true;
                if(!project.team){
                    project.hasTeam = false;
                }
            });
        res.render('projects/all-projects',{projects});
    },
    searchProjects: async (req,res) => {
        let searchQuery =req.query.searchQuery;
        let projects = await Project.find()
            .populate('team');
        const filteredProjects = projects.filter((p)=>{
            return p.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        filteredProjects.forEach(project => {
            project.hasTeam = true;
            if(!project.team){
                project.hasTeam = false;
            }
        });

        res.render('projects/all-projects',{projects:filteredProjects});


    }

};