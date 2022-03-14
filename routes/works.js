let express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');


// display task page
/*
router.get('/', function (req, res, next) {
    dbConn.query('SELECT * FROM task ORDER BY taskID desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            // render to views/works/index.ejs
            res.render('works', {data: ''});
        } else {
            // render to views/works/index.ejs
            res.render('works', {data: rows});
        }
    });
});

 */


// display login page
//let employeeID;
//let projectID;
//let pmEmployeeID;
router.get('/login', function (req, res, next) {
    let employeeID;
    res.cookie(employeeID, req.cookies.employeeID);

    req.flash('error', "로그인 화면입니다.휴대전화 뒷번호 4자리를 입력하세요");

    res.render('works/login', {
        employeeID: ''
    });
    //res.render('works/projectList', {projectID: req.cookies.projectID});
    //res.render('works/projectList', {pmEmployeeID: req.cookies.pmEmployeeID});

    // render to add.ejs
    //res.render('works/login', {
    //    employeeID: ''
    //})
})


// check the employee
router.post('/login', function (req, res, next) {

    let employeeID = req.body.employeeID;
    let errors = false;

    res.cookie('employeeID', employeeID);
    //res.cookie('projectID', projectID);
    //employeeID = req.body.employeeID;
    //projectID = req.body.projectID;
    //res.cookie('employeeID', employeeID);
    //res.cookie('projectID', projectID);
    //res.cookie('pmEmployeeID', pmEmployeeID);
    //res.redirect('/login');


    if (employeeID < 0) {
        errors = true;
        // set flash message
        req.flash('error', "Please enter employeeID!");
        // render to add.ejs with flash message
        res.render('works/login', {
            employeeID: employeeID,
            //projectID: projectID
        })
    }

    // if no error
    if (!errors) {
        var form_data = {
            employeeID: employeeID
        }

        // select query
        dbConn.query('SELECT employeeName FROM employee where employeeID = ' + employeeID, function (err, rows, fields) {
            if (err) throw err

            // if task not found
            if (rows.length <= 0) {
                req.flash('error', 'Task not found with employeeID = ' + employeeID)
                res.redirect('/works/login')
            }
            // if task found
            else {
                // set flash message
                req.flash('error', rows[0].employeeName + "님");
                res.cookie('employeeID', employeeID);
                //res.redirect('/works/projectList/' + employeeID)
                res.redirect('/works/board')
                //res.render('works/projectList', {
                //})
                //res.render('works/projectList', {
                //    employeeID: employeeID
                //})
            }
        })
    }
})

router.get('/board', function (req, res, next) {

    let employeeID = req.body.employeeID;
    let errors = false;

    res.cookie(employeeID, req.cookies.employeeID)

    // res.cookie('employeeID', employeeID);

    employeeID = req.cookies.employeeID;

    req.flash('error', " 프로젝트와 태스크 보드입니다.");

    res.render('works/board', {
        employeeID: employeeID
    })
})

//router.post('/board',function (req,res,next){
//    res.render('works/board')
//})


// display project register page
router.get('/projectRegister', function (req, res, next) {
    // render to add.ejs

    req.flash('error', "신규 프로젝트를 생성하는 프로젝트 등록 화면입니다.");

    res.render('works/projectRegister', {
        projectID: '',
        projectName: '',
        revenue: '',
        time: '',
        begin: '',
        end: '',
        customer: '',
        pm: '',
        pmEmployeeID: ''
    })
})

// register a project
router.post('/projectRegister', function (req, res, next) {

    let projectID = req.body.projectID;
    let projectName = req.body.projectName;
    let revenue = req.body.revenue;
    let time = req.body.time;
    let begin = req.body.begin;
    let end = req.body.end;
    let customer = req.body.customer;
    let pm = req.body.pm;
    let pmEmployeeID = req.body.pmEmployeeID;
    let errors = false;

    if (projectName.length === 0 || pmEmployeeID === 0) {
        errors = true;

        // set flash message
        req.flash('error', "프로젝트명과 PM의 휴대전화 뒷번호 4자리를 입력해 주세요.");
        // render to add.ejs with flash message
        res.render('works/projectRegister', {
            projectID: projectID,
            projectName: projectName,
            revenue: revenue,
            time: time,
            begin: begin,
            end: end,
            customer: customer,
            pm: pm,
            pmEmployeeID: pmEmployeeID

        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            projectID: projectID,
            projectName: projectName,
            revenue: revenue,
            time: time,
            begin: begin,
            end: end,
            customer: customer,
            pm: pm,
            pmEmployeeID: pmEmployeeID
        }

        // insert query
        dbConn.query('INSERT INTO project SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('works/add', {
                    projectID: form_data.projectID,
                    projectName: form_data.projectName,
                    revenue: form_data.revenue,
                    time: form_data.time,
                    begin: form_data.begin,
                    end: form_data.end,
                    customer: form_data.customer,
                    projectID: form_data.projectID,
                    pm: form_data.pm,
                    pmEmployeeID: form_data.pmEmployeeID

                })
            } else {
                req.flash('success', 'Task successfully added');
                res.redirect('/works/login');
            }
        })
    }
})


// display add task page
router.get('/add', function (req, res, next) {
    // render to add.ejs

    /*
    router.get('/', function (req, res, next) {
        connection.query('SELECT * from employee WHERE safe = 0', function (error, rows, fields) {
            if (error) {
                res.send(JSON.stringify({
                    "status": 500,
                    "error": error,
                    "response": null
                }));
                //If there is error, we send the error in the error section with 500 status
            } else {
                res.render(unsafefoods, {
                    title: 'Unsafe foods list',
                    data: rows
                })
            }
        });
    });
*/
    //res.render('index', {employeeID: req.cookies.employeeID});
    // res.render('index', {projectID: req.cookies.projectID});
    //res.cookie('employeeID',req.cookies.employeeID);
    //res.cookie('projectID',req.cookies.projectID);

    res.render('works/add', {
        taskID: '',
        employeeID: '',
        taskBegin: '',
        taskEnd: '',
        estimatedTime: '',
        taskDetail: '',
        projectID: req.cookies.projectID,
        taskTypeID: ''
    })
})

// add a new task
router.post('/add', function (req, res, next) {

    let taskID = req.body.taskID;
    let employeeID = req.body.employeeID;
    let taskBegin = req.body.taskBegin;
    let taskEnd = req.body.taskEnd;
    let estimatedTime = req.body.estimatedTime;
    let taskDetail = req.body.taskDetail;
    let projectID = req.body.projectID;
    let taskTypeID = req.body.taskTypeID;
    let errors = false;

    res.cookie('employeeID', employeeID);
    res.cookie('projectID', projectID);

    if (taskDetail.length === 0 || taskTypeID === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and taskDetail and taskTypeID");
        // render to add.ejs with flash message
        res.render('works/add', {
            taskID: taskID,
            employeeID: employeeID,
            taskBegin: taskBegin,
            taskEnd: taskEnd,
            estimatedTime: estimatedTime,
            taskDetail: taskDetail,
            projectID: projectID,
            taskTypeID: taskTypeID
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            taskID: taskID,
            employeeID: employeeID,
            taskBegin: taskBegin,
            taskEnd: taskEnd,
            estimatedTime: estimatedTime,
            taskDetail: taskDetail,
            projectID: projectID,
            taskTypeID: taskTypeID
        }

        // insert query
        dbConn.query('INSERT INTO task SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('works/add', {
                    taskID: form_data.taskID,
                    employeeID: form_data.employeeID,
                    taskBegin: form_data.taskBegin,
                    taskEnd: form_data.taskEnd,
                    estimatedTime: form_data.estimatedTime,
                    taskID: form_data.taskID,
                    taskDetail: form_data.taskDetail,
                    //projectID: form_data.projectID,
                    taskTypeID: form_data.taskTypeID
                })
            } else {
                req.flash('success', 'Task successfully added');
                res.redirect('/works/taskList/' + projectID);
            }
        })
    }
})

// display edit task page
router.get('/edit/(:taskID)', function (req, res, next) {

    let taskID = req.params.taskID;

    dbConn.query('SELECT * FROM task WHERE taskID = ' + taskID, function (err, rows, fields) {
        if (err) throw err

        // if task not found
        if (rows.length <= 0) {
            req.flash('error', 'Task not found with taskID = ' + taskID)
            res.redirect('/works')
        }
        // if task found
        else {
            // render to edit.ejs
            res.render('works/edit', {
                title: 'Edit Task',
                taskID: rows[0].taskID,
                employeeID: rows[0].employeeID,
                taskBegin: rows[0].taskBegin,
                taskEnd: rows[0].taskEnd,
                estimatedTime: rows[0].estimatedTime,
                actualTime: rows[0].actualTime,
                taskDetail: rows[0].taskDetail,
                projectID: rows[0].projectID,
                taskTypeID: rows[0].taskTypeID
            })
        }
    })
})

// update task data
router.post('/update/:taskID', function (req, res, next) {

    let taskID = req.params.taskID;
    let employeeID = req.body.employeeID;
    let taskBegin = req.body.taskBegin;
    let taskEnd = req.body.taskEnd;
    let estimatedTime = req.body.estimatedTime;
    let actualTime = req.body.actualTime;
    let taskDetail = req.body.taskDetail;
    let projectID = req.body.projectID;
    let taskTypeID = req.body.taskTypeID;
    let errors = false;

    if (estimatedTime.length === 0 || taskDetail.length === 0 || taskTypeID.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and taskDetail and taskTypeID");
        // render to add.ejs with flash message
        res.render('works/edit', {
            taskID: req.params.taskID,
            employeeID: employeeID,
            taskBegin: taskBegin,
            taskEnd: taskEnd,
            estimatedTime: estimatedTime,
            actualTime: actualTime,
            taskDetail: taskDetail,
            projectID: projectID,
            taskTypeID: taskTypeID
        })
    }

    // if no error
    if (!errors) {
        var form_data = {
            taskID: taskID,
            employeeID: employeeID,
            taskBegin: taskBegin,
            taskEnd: taskEnd,
            estimatedTime: estimatedTime,
            actualTime: actualTime,
            taskDetail: taskDetail,
            projectID: projectID,
            taskTypeID: taskTypeID
        }
        // update query
        dbConn.query('UPDATE task SET ? WHERE taskID = ' + taskID, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('works/edit', {
                    taskID: req.params.taskID,
                    //taskID: form_data.taskID,
                    employeeID: form_data.employeeID,
                    taskBegin: form_data.taskBegin,
                    taskEnd: form_data.taskEnd,
                    estimatedTime: form_data.estimatedTime,
                    actualTime: form_data.actualTime,
                    taskID: form_data.taskID,
                    taskDetail: form_data.taskDetail,
                    projectID: form_data.projectID,
                    taskTypeID: form_data.taskTypeID
                })
            } else {
                req.flash('success', 'Project successfully registration!');
                res.redirect('/works/myTaskList/' + employeeID);
            }
        })
    }
})

// delete task
router.get('/delete/(:taskID)', function (req, res, next) {

    let taskID = req.params.taskID;

    dbConn.query('DELETE FROM task WHERE taskID = ' + taskID, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to task page
            res.redirect('/works')
        } else {
            // set flash message
            req.flash('success', 'Task successfully deleted! taskID = ' + taskID)
            // redirect to task page
            res.redirect('/works')
        }
    })
})


/*
express().listen(3000, () => {
    console.log('3000 port');
});
*/

router.get('/projectList/(:pmEmployeeID)', function (req, res, next) {
//    dbConn.query('SELECT * FROM project ORDER BY projectID desc',function(err,rows)     {
    //     dbConn.query('SELECT * FROM project WHERE pmEmployeeID = ' +pmEmployeeID,function(err,rows)     {

    //res.render('works/login', {projectID: req.cookies.projectID});
    //res.cookie('projectID',req.cookies.projectID);

    let pmEmployeeID = req.params.pmEmployeeID;
    dbConn.query('SELECT * FROM project WHERE pmEmployeeID =' + pmEmployeeID, function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('works/projectList', {data: ''});
        } else {
            // render to views/works/index.ejs
            req.flash('error', rows[0].pm + "님이 소유하고 계신 프로젝트입니다.");
            res.cookie('projectID', rows[0].projectID);
            res.render('works/projectList', {data: rows});
        }
    });
});


router.post('/projectList/(:pmEmployeeID)', function (req, res, next) {
    let projectID = req.body.projectID;
    let projectName = req.body.projectName;
    let revenue = req.body.revenue;
    let time = req.body.time;
    let begin = req.body.begin;
    let end = req.body.end;
    let customer = req.body.customer;
    let customerAddress = req.body.customerAddress;
    let pm = req.body.pm;
    let pmEmployeeID = req.body.pmEmployeeID;
    let errors = false;

    dbConn.query('SELECT * FROM project WHERE pmEmployeeID = ' + pmEmployeeID, function (err, rows) {
        req.flash('error', err)

        // render to views/user/add.ejs
        //res.cookie('projectID', projectID);

        req.flash('message', rows[0].pm + "님이 소유하고 계신 프로젝트입니다.");
        res.cookie('projectID', rows.projectID);
        res.render('works/projectList', {
            projectID: rows.projectID,
            projectName: rows.projectName,
            revenue: rows.revenue,
            time: rows.time,
            begin: rows.begin,
            end: rows.end,
            customer: rows.customer,
            customerAddress: rows.customerAddress,
            pm: rows.pm,
            pmEmployeeID: rows.pmEmployeeID
        })


    });
});

router.get('/myTaskList/(:employeeID)', function (req, res, next) {
    let projectID = req.params.projectID;

    let employeeID = req.params.employeeID;

    //res.cookie(employeeID,req.cookies.employeeID);

    // let employeeID = req.cookie.employeeID;

    dbConn.query('SELECT * FROM task inner join project on task.employeeID = project.pmEmployeeID inner join employee on task.employeeID = employee.employeeID inner join tasktype on task.taskTypeID = tasktype.taskTypeID WHERE task.employeeID =' + employeeID, function (err, rows) {
        //       dbConn.query('SELECT * FROM task WHERE employeeID =' + employeeID, function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('works/myTaskList', {data: ''});
        } else {
            req.flash('error', rows[0].projectName + " 에서 수행 중인 태스크입니다.");
            res.render('works/myTaskList', {data: rows});
        }
    });
});


router.post('/myTaskList/(:employeeID)', function (req, res, next) {
    let taskID = req.body.taskID;
    let employeeID = req.body.employeeID;
    let employeeName = req.body.employeeName;
    let taskBegin = req.body.taskBegin;
    let taskEnd = req.body.taskEnd;
    let estimatedTime = req.body.estimatedTime;
    let taskDetail = req.body.taskDetail;
    let projectID = req.body.projectID;
    let taskTypeID = req.body.taskTypeID;
    let errors = false;

    employeeID = req.params.employeeID;

    dbConn.query('SELECT * FROM task inner join employee on task.employeeID = project.employeeID  WHERE task.employeeID =' + employeeID, function (err, rows) {
//        dbConn.query('SELECT * FROM task WHERE employeeID =' + employeeID, function (err, rows) {
        req.flash('error', err)
        // render to views/user/add.ejs
        req.flash('error', "The Task(s) from the Project " + projectID);
        res.render('works/taskList', {
            taskID: rows.taskID,
            employeeID: rows.employeeID,
            employeeName: rows.employeeName,
            taskBegin: rows.taskBegin,
            taskBegin: rows.taskEnd,
            estimatedTime: rows.estimatedTime,
            taskDetail: rows.taskDetail,
            projectID: rows.projectID,
            taskTypeID: rows.taskTypeID
        })
    });
});


router.get('/taskList/(:projectID)', function (req, res, next) {
    let projectID = req.params.projectID;
    //dbConn.query('SELECT * FROM task WHERE projectID =' + projectID, function (err, rows) {
    dbConn.query('SELECT * FROM task inner join project on task.employeeID = project.pmEmployeeID inner join employee on task.employeeID = employee.employeeID inner join tasktype on task.taskTypeID = tasktype.taskTypeID WHERE task.projectID =' + projectID, function (err, rows) {

        //dbConn.query('SELECT * FROM task inner join project on task.projectID = project.projectID  WHERE task.projectID =' + projectID, function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('works/taskList', {data: ''});
        } else {
            req.flash('error', rows[0].projectName + "에서 수행 중인 태스크입니다.");
            res.render('works/taskList', {data: rows});
        }
    });
});


router.post('/taskList/(:projectID)', function (req, res, next) {
    let taskID = req.body.taskID;
    let employeeID = req.body.employeeID;
    let taskBegin = req.body.taskBegin;
    let taskEnd = req.body.taskEnd;
    let estimatedTime = req.body.estimatedTime;
    let taskDetail = req.body.taskDetail;
    let projectID = req.body.projectID;
    let taskTypeID = req.body.taskTypeID;
    let errors = false;

    //dbConn.query('SELECT * FROM task WHERE projectID =' + projectID, function (err, rows) {
    dbConn.query('SELECT * FROM task inner join project on task.projectID = project.projectID  WHERE task.projectID =' + projectID, function (err, rows) {

        req.flash('error', err)
        // render to views/user/add.ejs
        req.flash('error', rows[0].projectName + "에서 수행 중인 태스크입니다.");
        res.render('works/taskList', {
            taskID: rows.taskID,
            employeeID: rows.employeeID,
            taskBegin: rows.taskBegin,
            taskBegin: rows.taskEnd,
            estimatedTime: rows.estimatedTime,
            taskDetail: rows.taskDetail,
            projectID: rows.projectID,
            taskTypeID: rows.taskTypeID
        })
    });
});


module.exports = router;