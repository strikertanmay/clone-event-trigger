const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const nodemailer = require("nodemailer"),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'tanmaymittal0@gmail.com',
            pass: 'legiony520'
        }
    }),
    EmailTemplate = require("email-templates").EmailTemplate,
    path = require("path"),
    Promise = require("bluebird");
app.use(bodyParser.json());

function sendEmail(obj) {
    return transporter.sendMail(obj);
}

function loadTemplate(templateName, contexts) {
    let template = new EmailTemplate(
        path.join(__dirname, "templates", templateName)
    );

    return Promise.all(
        contexts.map(context => {
            return new Promise((resolve, reject) => {
                template.render(context.new, (err, result) => {
                    if (err) reject(err);
                    else
                        resolve({
                            email: result,
                            context
                        });
                });
            });
        })
    );
}

function echo(event) {
    if (event.op === "INSERT") {
        responseBody = `New user ${event.data.new.id} inserted, with data: ${
            event.data.new.name
            }`;

        loadTemplate("welcome", [event.data])
            .then(results => {
                return Promise.all(
                    results.map(result => {
                        sendEmail({
                            to: result.context.new.email,
                            from: "tanmaymittal0@gmail.com",
                            subject: result.email.subject,
                            html: result.email.html,
                            text: result.email.text
                        });
                    })
                );
            })
            .catch(e => {
                console.log("Error Found: ", e);
            });
    } else if (event.op === "UPDATE") {
        responseBody = `User ${event.data.new.id} updated, with data: ${
            event.data.new.name
            }`;
    } else if (event.op === "DELETE") {
        responseBody = `User ${event.data.old.id} deleted, with data: ${
            event.data.old.name
            }`;
    }

    return responseBody;
}

function echo(event2){
    let responseBody = "";

    if (event2.op === "INSERT") {
        responseBody = `New project ${event2.data.new.id} inserted, with data: ${
            event2.data.new.project_name
            }`;

        loadTemplate("Add_Project", [event2.session_variables])
            .then(results => {
                return Promise.all(
                    results.map(result => {
                        sendEmail({
                            to: result.context.x - hasura - email,
                            from: "tanmaymittal0@gmail.com",
                            subject: result.email.subject,
                            html: result.email.html,
                            text: result.email.text
                        });
                    })
                );
            })
            .catch(e => {
                console.log("Error Found: ", e);
            });
    } else if (event2.op === "UPDATE") {
        responseBody = `User ${event2.data.new.id} updated, with data: ${
            event2.data.new.project_name
            }`;
    } else if (event2.op === "DELETE") {
        responseBody = `User ${event2.data.old.id} deleted, with data: ${
            event2.data.old.project_name
            }`;
    }

    return responseBody;    
}
   


app.post("/", function (req, res) {
    try {
        let event = req.body.event;
        let result = echo(event);

        res.json(result);
    } catch (e) {

        console.log(e);
        res.status(500).json(e.toString());
    }
});

app.post("/addproject", function (req, res) {
    try {
        let event2 = req.body.event;
        let result1 = echo(event2);

        res.json(result1);
        // console.log(res);
    } catch (e) {

        console.log(e);
        res.status(500).json(e.toString());
    }
});

app.get("/", function (req, res) {
    res.send("Hello World - For Event Triggers, try a POST request?");
});

app.get("/addproject", function (req, res) {
    res.send("Hello World - For Event Triggers, try a POST request?");

});

let server = app.listen(process.env.PORT || 5000, function (err) {
    if (!err) {
        console.log("Server Listening on PORT " + server.address().port);
    } else {
        console.log(err);
    }
});
