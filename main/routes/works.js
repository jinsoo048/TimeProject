let express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display work page
router.get('/', function(req, res, next) {      
    dbConn.query('SELECT * FROM works ORDER BY workID desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            // render to views/works/index.ejs
            res.render('works',{data:''});
        } else {
            // render to views/works/index.ejs
            res.render('works',{data:rows});
        }
    });
});

// display add work page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('works/add', {
        workID: '',
        employeeID: '',
        workBegin: '',
        workEnd: '',
        workingTime: '',
        workDetail: '',
        projectID: '',
        workTypeID:''
    })
})

// add a new work
router.post('/add', function(req, res, next) {    

    let workID = req.body.workID;
    let employeeID = req.body.employeeID;
    let workBegin = req.body.workBegin;
    let workEnd = req.body.workEnd;
    let workingTime = req.body.workingTime;
    let workDetail = req.body.workDetail;
    let projectID = req.body.projectID;
    let workTypeID = req.body.workTypeID;
    let errors = false;

    if(workDetail.length === 0 || workTypeID === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and workDetail and workTypeID");
        // render to add.ejs with flash message
        res.render('works/add', {
            workID: workID,
            employeeID: employeeID,
            workBegin: workBegin,
            workEnd: workEnd,
            workingTime: workingTime,
            workDetail: workDetail,
            projectID: projectID,
            workTypeID: workTypeID
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            workID: workID,
            employeeID: employeeID,
            workBegin: workBegin,
            workEnd: workEnd,
            workingTime: workingTime,
            workDetail: workDetail,
            projectID: projectID,
            workTypeID: workTypeID
        }
        
        // insert query
        dbConn.query('INSERT INTO works SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('works/add', {
                    workID: form_data.workID,
                    employeeID: form_data.employeeID,
                    workBegin: form_data.workBegin,
                    workEnd: form_data.workEnd,
                    workingTime: form_data.workingTime,
                    workID: form_data.workID,
                    workDetail: form_data.workDetail,
                    projectID: form_data.projectID,
                    workTypeID:form_data.workTypeID
                })
            } else {                
                req.flash('success', 'Work successfully added');
                res.redirect('/works/workList/'+ projectID);
            }
        })
    }
})

// display edit work page
router.get('/edit/(:workID)', function(req, res, next) {

    let workID = req.params.workID;
   
    dbConn.query('SELECT * FROM works WHERE workID = ' + workID, function(err, rows, fields) {
        if(err) throw err
         
        // if work not found
        if (rows.length <= 0) {
            req.flash('error', 'Work not found with workID = ' + workID)
            res.redirect('/works')
        }
        // if work found
        else {
            // render to edit.ejs
            res.render('works/edit', {
                title: 'Edit Work', 
                workID: rows[0].workID,
                employeeID: rows[0].employeeID,
                workBegin: rows[0].workBegin,
                workEnd: rows[0].workEnd,
                workingTime: rows[0].workingTime,
                workDetail: rows[0].workDetail,
                projectID: rows[0].projectID,
                workTypeID: rows[0].workTypeID
            })
        }
    })
})

// update work data
router.post('/update/:workID', function(req, res, next) {

    let workID = req.params.workID;
    let employeeID = req.body.employeeID;
    let workBegin = req.body.workBegin;
    let workEnd = req.body.workEnd;
    let workingTime = req.body.workingTime;
    let workDetail = req.body.workDetail;
    let projectID = req.body.projectID;
    let workTypeID = req.body.workTypeID;
    let errors = false;

    if(workingTime.length === 0 || workDetail.length === 0 || workTypeID.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and workDetail and workTypeID");
        // render to add.ejs with flash message
        res.render('works/edit', {
            workID: req.params.workID,
            employeeID: employeeID,
            workBegin: workBegin,
            workEnd: workEnd,
            workingTime: workingTime,
            workDetail: workDetail,
            projectID: projectID,
            workTypeID: workTypeID
        })
    }

    // if no error
    if( !errors ) {   
         var form_data = {
            workID: workID,
            employeeID: employeeID,
            workBegin: workBegin,
            workEnd: workEnd,
            workingTime: workingTime,
            workDetail: workDetail,
            projectID: projectID,
            workTypeID: workTypeID
        }
        // update query
        dbConn.query('UPDATE works SET ? WHERE workID = ' + workID, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('works/edit', {
                    workID: req.params.workID,
                    //workID: form_data.workID,
                    employeeID: form_data.employeeID,
                    workBegin: form_data.workBegin,
                    workEnd: form_data.workEnd,
                    workingTime: form_data.workingTime,
                    workID: form_data.workID,
                    workDetail: form_data.workDetail,
                    projectID: form_data.projectID,
                    workTypeID:form_data.workTypeID
                })
            } else {
                req.flash('success', 'Work successfully updated');
                res.redirect('/works/workList/'+ projectID);
            }
        })
    }
})
   
// delete work
router.get('/delete/(:workID)', function(req, res, next) {

    let workID = req.params.workID;
     
    dbConn.query('DELETE FROM works WHERE workID = ' + workID, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to work page
            res.redirect('/works')
        } else {
            // set flash message
            req.flash('success', 'Work successfully deleted! workID = ' + workID)
            // redirect to work page
            res.redirect('/works')
        }
    })
})


// display add work page
router.get('/login', function(req, res, next) {
    // render to add.ejs
    res.render('works/login', {
        employeeID: ''
    })
})


// check the employee
router.post('/login', function(req, res, next) {
    let employeeID = req.body.employeeID;
    let errors = false;

    //employeeID = req.params.employeeID
    if(employeeID < 0) {
        errors = true;
        // set flash message
        req.flash('error', "Please enter employeeID!");
        // render to add.ejs with flash message
        res.render('works/login', {
            employeeID: employeeID
        })
    }

    // if no error
    if(!errors) {
        var form_data = {
            employeeID: employeeID
        }

        // select query
        dbConn.query('SELECT employeeName FROM employee where employeeID = ' +employeeID, function(err,rows, fields) {
            if(err) throw err

            // if work not found
            if (rows.length <= 0) {
                req.flash('error', 'Work not found with employeeID = ' + employeeID)
                res.redirect('/works/login')
            }
            // if work found
            else {
                // set flash message
                req.flash('error', "You are " + rows[0].employeeName);
                res.redirect('/works/projectList')
                //res.render('works/projectList', {
                //})
            }
        })
    }
})

router.get('/projectList', function(req, res, next) {
    dbConn.query('SELECT * FROM project ORDER BY projectID desc',function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('works/projectList',{data:''});
        } else {
            // render to views/works/index.ejs
            res.render('works/projectList',{data:rows});
        }
    });
});


router.post('/projectList', function(req, res, next) {
    let projectID = req.body.projectID;
    let projectName = req.body.projectName;
    let revenu = req.body.revenu;
    let time = req.body.time;
    let begin = req.body.begin;
    let end = req.body.end;
    let customer = req.body.customer;
    let customerAddress = req.body.customerAddress;
    let errors = false;

        dbConn.query('SELECT * FROM project ORDER BY projectID desc',function(err,rows)     {
            req.flash('error', err)

            // render to views/user/add.ejs
            res.render('works/projectList', {
                projectID: rows.projectID,
                projectName: rows.projectName,
                revenue: rows.revenue,
                time: rows.time,
                begin: rows.begin,
                end: rows.end,
                customer: rows.customer,
                customerAddress: rows.customerAddress

            })
        });
    });

router.get('/workList/(:projectID)', function(req, res, next) {
    let projectID = req.params.projectID;
    dbConn.query('SELECT * FROM works WHERE projectID =' + projectID , function(err,rows)     {
        if(err) {
            req.flash('error', err);
            res.render('works/workList',{data:''});
        } else {
            req.flash('error', "The Work(s) from the Project " + projectID);
            res.render('works/workList',{data:rows});
        }
    });
});


router.post('/workList/(:projectID)', function(req, res, next) {
    let workID = req.body.workID;
    let employeeID = req.body.employeeID;
    let workBegin = req.body.workBegin;
    let workEnd = req.body.workEnd  ;
    let workingTime = req.body.workingTime;
    let workDetail = req.body.workDetail;
    let projectID = req.body.projectID;
    let workTypeID = req.body.workTypeID;
    let errors = false;

    dbConn.query('SELECT * FROM works WHERE projectID =' + projectID , function(err,rows)     {
        req.flash('error', err)
        // render to views/user/add.ejs
        req.flash('error', "The Work(s) from the Project " + projectID);
        res.render('works/workList', {
            workID: rows.workID,
            employeeID: rows.employeeID,
            workBegin: rows.workBegin,
            workBegin: rows.workEnd,
            workingTime: rows.workingTime,
            workDetail: rows.workDetail,
            projectID: rows.projectID,
            workTypeID: rows.workTypeID
        })
    });
});

module.exports = router;