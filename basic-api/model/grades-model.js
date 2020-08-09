
//Null and empty string are both falsey values in JavaScript.
function validateGrade(grade){
    if(!grade.student)
        throw new Exception("Student's name cannot be empty.");
    
    if(!grade.subject)
        throw new Exception("Subject cannot be empty.");
    
    if(!grade.type)
        throw new Exception("Type cannot be empty.");

    if(!grade.value)
        throw new Exception("Subject cannot be null or undefined.");
}

function createGrade(grade){

    validateGrade(grade);

    return  {
        student : grade.student,
        subject : grade.subject,
        type : grade.type,
        timestamp : new Date(),
        value : grade.value
    };
}


export {createGrade}