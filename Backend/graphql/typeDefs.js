const { gql } = require('graphql-tag');
const GraphQLJSON = require('graphql-type-json'); // Import JSON scalar type


// Define GraphQL schema
const typeDefs = gql`

    scalar JSON  # Define the custom JSON scalar type

    type User {
    id: ID!
    studentid: Int!
    name: String!
    email: String!
    password: String!
    year: Int
    created_at: String
    }

    type Resource {
    resource_id: ID!
    skill_name: String!
    description: String
    category: String
    resources: [String]
    tags: [String]
    created_at: String
    updated_at: String
    }


    type Experience {
    experience_id: ID!
    studentid: Int!
    company_name: String!
    position: String!
    interview_type: String!
    interview_rounds: Int!
    duration: Int
    user : User!
    interview_location: String!
    difficulty_level: String!
    interview_questions: String
    interview_experience: String
    outcome: String!
    feedback: String
    tips: String
    preplinks: JSON
    resources: String
    created_at: String
    updated_at: String
    }

    type CourseReview {
    course_id: ID!
    course_name: String!
    course_code: String!
    instructor_names: JSON!
    institution: String!
    semester: String!
    studentid: Int!
    user : User
    experience_rating: Int
    review: String!
    tips: String
    created_at: String
    updated_at: String
    }


    type Query {
        getExperienceByCompany(company_name: String!): [Experience]
        getExperiences(page:Int, limit:Int ): [Experience]
        getCourseDetails(course_code: String!): [CourseReview]
        getAllCourses(page: Int, limit:Int): [CourseReview]
        getResource(skill_name: String!): [Resource]
        listResources(page: Int, limit: Int): [Resource]
    }

    type Mutation {
        addExperience(input: ExperienceInput): Experience
        addCourse(input: CourseInput): CourseReview
        addSkill(skill_name: String!, description: String, category: String, resources: JSON, tags: JSON): Resource
        updateResourceByName(skill_name: String! ,additional_resources: [String], additional_tags: [String]): Resource
    }

    input ExperienceInput {
        studentid: Int!
        company_name: String!
        position: String!
        interview_type: String!
        interview_rounds: Int!
        duration: Int
        interview_location: String!
        difficulty_level: String!
        interview_questions: String
        interview_experience: String
        outcome: String!
        feedback: String
        tips: String
        preplinks: JSON
        resources: String
    }

    input CourseInput {
    course_name: String!
    course_code: String!
    instructor_names: [String]!
    institution: String!
    semester: String!
    studentid: Int!
    experience_rating: Int
    review: String
    tips: String
  }
`;

module.exports = typeDefs;
