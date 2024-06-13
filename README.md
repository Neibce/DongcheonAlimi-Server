# DongcheonAlimi-Server
[동천알리미 안드로이드 어플리케이션](https://github.com/Neibce/Dongcheon-Alimi)의 RESTful API Server
- Node.js with Express and PM2, Google Firebase SDK(admin), MariaDB, NGINX for Reverse proxy
- 2020년 2분기
- 전체 설명은 [어플리케이션 README](https://github.com/Neibce/Dongcheon-Alimi) 참고

## 서버 및 네트워크 구성도
![image](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/3ce4fed1-1e06-4e2a-92d2-d7e8c18635ae)

- PM2 with Cluster Mode

![image](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/7d3eef56-c57f-447a-b5bb-bbd032b7c61b)

### /schedules (시간표)
  - ```/:grade/:class```
### /exams (시험 일정)
  - ```/:year```
### /classes (학년 별 반 개수)
  - ```/count/:grade```
### /board (게시판)
  - ```/``` ```/new``` ```/list``` ```/:postId``` ```/:postId/delete``` ```/:postId/edit```
### /quiz (퀴즈)
  - ```/new``` ```/check-answer```
### /images (이미지 반환)
  - ```/:imageName```
    
## Database 구성(실제 내용 중 일부)
### T_SCHOOL_SCHEDULES(시험 일정)
![image](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/2e6aa506-c8c5-4c7c-9273-e5c553f1bb3b)

### T_SCHOOL_CLASSES(반별 시간표)
![image](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/3a25867c-b673-42f8-a30b-97cb26d306a8)

### T_QUIZZES(게시글 작성용 퀴즈)
![image](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/8a2d87c7-7f7e-4671-b14d-8871e66bdc8c)

### T_BOARD(게시글)
![image](https://github.com/Neibce/Dongcheon-Alimi-API/assets/18096595/4f33e184-7782-4716-95ec-c2039479931a)
