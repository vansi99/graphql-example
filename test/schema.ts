import { gql } from 'apollo-server-express'

const typeDefs = gql`type User {
    _id: ID
    username: String
    email: String
    roles: [String]
  }
  
  type Query {
    getPublisher: UsersResponse
  }
  
  type Mutation {
    addUser(inputObject: InputAddUser!): UserResponse
  }
  
  input InputAddUser {
    username: String!
    email: String!
    password: String!
    roles: [String!]
  }
  
  type UsersResponse {
    data: [User]
    error: String
  }
  
  type UserResponse {
    data: User
    error: String
  }
  
  type Query {
    getToken(email: String, password: String): TokenResponse
  }
  
  type TokenResponse {
    data: String
    error: String
  }
  
  type News {
      _id: ID
      title: String
      thumbUrl: String
      description: String
      content: String
      readNumber: Int
      categories: [Category]
      publisher: User
  }
  
  type Query {
      getNews(limit: Int, offset: Int, sort: String, search: String): NewsResponse
      getDetailNews(_id: String): NewsDetailResponse
      getPublisherNews: NewsResponse
  }
  
  type Mutation {
      createNews(inputObject: InputCreateNews!): NewsDetailResponse
      updateNews(_id: String, inputObject: InputUpdateNews!): UpdateNewsResponse
      deleteNews(_id: String): DeleteResponse
  }
  
  input InputCreateNews {
      title: String!,
      thumbUrl: String!,
      description: String!,
      content: String!,
      categories: [String],
  }
  
  input InputUpdateNews {
      title: String,
      thumbUrl: String,
      description: String,
      content: String,
      categories: [String],
  }
  
  type NewsResponse {
      data: [News]
      error: String
  }
  
  type NewsDetailResponse {
      data: News
      error: String
  }
  
  type DeleteResponse {
      data: String
      error: String
  }
  
  type UpdateNewsResponse {
      data: String
      error: String
  }
  
  type Category {
      _id: ID
      name: String
      description: String
  }
  
  type Query {
      getCategories: CategoriesResponse
  }
  
  type Mutation {
      createCategory(inputObject: InputCreateCategory!): CreateCategoryResponse
  }
  
  input InputCreateCategory {
      name: String!
      description: String!
  }
  
  type CategoriesResponse {
      data: [Category]
      error: String
  }
  
  type CreateCategoryResponse {
      data: Category
      error: String
  }`

export = typeDefs
