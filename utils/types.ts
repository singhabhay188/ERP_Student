export type CourseFormData ={
    name: string
    subname: string
    collegeId: string
    expectedYears: number
}

export type StudentFormData = {
    enrollment: string;
    password: string;
    name: string;
    collegeId: string;
    imageUrl: string;
}

export type TeacherFormData = {
    name: string;
    username: string;
    password: string;
    collegeId: string;
    imageUrl: string;
}