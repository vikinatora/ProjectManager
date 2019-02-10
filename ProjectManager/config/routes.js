const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
    app.get('/', controllers.home.index);
    app.get('/register', restrictedPages.isAnonymous, controllers.user.registerGet);
    app.post('/register',restrictedPages.isAnonymous, controllers.user.registerPost);
    app.post('/logout', restrictedPages.isAuthed, controllers.user.logout);
    app.get('/login',restrictedPages.isAnonymous, controllers.user.loginGet);
    app.post('/login',restrictedPages.isAnonymous, controllers.user.loginPost);

    //Admin
    app.get('/teams/create', restrictedPages.hasRole('Admin'), controllers.team.createGet);
    app.post('/teams/create', restrictedPages.hasRole('Admin'), controllers.team.createPost);
    app.get('/teams/distribute', restrictedPages.hasRole('Admin'), controllers.team.distributeGet);
    app.post('/teams/distribute', restrictedPages.hasRole('Admin'), controllers.team.distributePost);

    app.get('/projects/create', restrictedPages.hasRole('Admin'), controllers.project.createGet);
    app.post('/projects/create', restrictedPages.hasRole('Admin'), controllers.project.createPost);
    app.get('/projects/distribute', restrictedPages.hasRole('Admin'), controllers.project.distributeGet);
    app.post('/projects/distribute', restrictedPages.hasRole('Admin'), controllers.project.distributePost);
    
    //Users
    app.get('/user/projects',restrictedPages.isAuthed,controllers.project.allProjects);
    app.get('/user/teams',restrictedPages.isAuthed,controllers.team.allTeams);
    app.get('/user/profile',restrictedPages.isAuthed,controllers.user.profile);
    app.post('/user/leaveTeam/:id',restrictedPages.isAuthed,controllers.user.leaveTeam);

    //Search
    app.get('/user/searchProjects',restrictedPages.isAuthed,controllers.project.searchProjects);
    app.get('/user/searchTeams',restrictedPages.isAuthed,controllers.team.searchTeams);

    app.all('*', (req, res) => {
        res.status(404);
        res.send('404 Not Found');
        res.end();
    });
};