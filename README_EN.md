# DongcheonAlimi-Server [![CodeFactor](https://www.codefactor.io/repository/github/neibce/dongcheonalimi-server/badge)](https://www.codefactor.io/repository/github/neibce/dongcheonalimi-server)

[한국어](./README.md)

RESTful API Server for [Dongcheon Alimi Android App](https://github.com/Neibce/DongcheonAlimi)

Developed in Q2 2020

- Node.js with Express and PM2
- Google Firebase SDK (Admin)
- MariaDB
- NGINX for Reverse Proxy
- Full description: [App README](https://github.com/Neibce/DongcheonAlimi)

## Server Architecture

![Server Architecture](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/3ce4fed1-1e06-4e2a-92d2-d7e8c18635ae)

- PM2 with Cluster Mode

![PM2 Screenshot](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/7d3eef56-c57f-447a-b5bb-bbd032b7c61b)

## API Endpoints

### /schedules (Timetable)
  - `/:grade/:class`
### /exams (Exam Schedule)
  - `/:year`
### /classes (Class Count per Grade)
  - `/count/:grade`
### /board (Bulletin Board)
  - `/` `/new` `/list` `/:postId` `/:postId/delete` `/:postId/edit`
### /quiz (Quiz)
  - `/new` `/check-answer`
### /images (Image)
  - `/:imageName`

## Database Schema

### T_SCHOOL_SCHEDULES (Exam Schedule)
![DB Table](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/2e6aa506-c8c5-4c7c-9273-e5c553f1bb3b)

### T_SCHOOL_CLASSES (Class Timetable)
![DB Table](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/3a25867c-b673-42f8-a30b-97cb26d306a8)

### T_QUIZZES (Post Authentication Quiz)
![DB Table](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/8a2d87c7-7f7e-4671-b14d-8871e66bdc8c)

### T_BOARD (Posts)
![DB Table](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/4f33e184-7782-4716-95ec-c2039479931a)
