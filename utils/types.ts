export type CourseFormData = {
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

export type Subject = {
    id: string
    code: string
    title: string
}

export type Group = {
    id: string
    name: string
    section: {
        name: string
        year: {
            semNum: number
            course: {
                name: string
                subname: string
            }
        }
    }
}

export type Teacher = {
    id: string;
    name: string;
} 