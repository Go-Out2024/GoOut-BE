
# Go OUT
## 💻 기술 스택

---

| 분류 | 개발환경 | 
|---|---|
| 운영체제 | Ubuntu |
| 개발도구 | VSCode, Postman |
| 프레임워크 | Express.js |
| 디자인 패턴 | Constructor Dependency Injection Pattern |
| 데이터베이스 | Mysql(8.0.35), Redis (7.1.0)|
| 버전 관리 | Github, Git |
| 협업 툴 | Slack, Notion, Figma |
| 시스템 아키텍처 | 서비스 지향 아키텍처(SOA) |
| 배포 및 운영 | AWS, Docker, Github Actions(CI/CD) |

## 🛠 세부 기술 스택(Tech Stack)

### 백엔드(Back-end)

- **Node.js 18.6**

### 데이터베이스(Database)

- **Mysql (8.0.35)**
- **Redis (7.1.0)**

### 클라우드 서비스(Amazon Web Service)
  - AWS EC2
  - AWS RDS
  - AWS Elastic Cache

📌 **Code Convention**

- **변수**
    1. 변수명은 Camel Case 사용
        
        ```tsx
        const example = 1;
        let example2;
        example2 = 2;
        ```
    2. 함수의 경우 동사+명사 사용
        - 예: `getInformation()`
    3. `var` 변수 선언은 지양한다.
    4. 약어는 되도록 사용하지 않는다.
        - 부득이하게 약어가 필요하다고 판단되는 경우 팀원과 상의를 거친다.

- **주석**
    1. 한 줄 주석 `//`은 응용 서비스 함수가 10줄 이내일 경우 매 줄마다 설명을 추가할 때 사용한다.
        
        ```tsx
        // 한줄 주석일 때
        /**
        * 여러줄
        * 주석일 때
        */
        ```
    2. 함수 주석 모든 함수에 docs를 붙여 사용한다.
        
        ```tsx
        /**
         * @route Method /Route
         * @desc Function Description
         * @access Public
         */
        ```

- **비동기 함수의 사용**
    1. `async`, `await` 함수 사용을 지향한다.
    2. `Promise` 사용은 지양한다.
    3. 다만 로직을 짜는 데 있어 `Promise`를 불가피하게 사용할 경우, 주석으로 표시하고 commit에 그 이유를 작성한다.

- **함수명**
    1. controller, service 함수명
        - controller와 service 함수명은 동일하다.
            - 조회 함수: `bring`
            - 수정 함수: `modify`
            - 삭제 함수: `erase`
            - 삽입 함수: `penetrate`
        - 이외 다른 함수는 상황에 맞는 명을 지정 후 함수 docs를 사용하여 명시한다.
        
        ```tsx
        // 조회 함수 가져올 데이터에 대한 타입은 dto타입으로 지정하여 이름에 붙여준다.
        public async bringUser(userId: number): Promise<User> {
        }

        // 수정할 객체를 modify 뒤에 붙여준다.
        public async modifyUser(userId: number) {
        }

        // 삭제할 객체를 erase 뒤에 붙여준다.
        public async eraseUser(userId: number) {
        }

        // 삽입할 객체를 penetrate 뒤에 붙여준다.
        public async penetrateUser(userId: number) {
        }

        // 이외 다른 종류의 함수 예시
        public async login(user: User) {
        }
        ```
    2. 데이터베이스 접근 함수
        - Repository, Dao 함수
            - 조회, 업데이트, 삭제, 삽입 시
                - 맨 앞에 `find`, `update`, `delete`, `insert`를 붙인다.
                - 같은 테이블 조건 시 마지막에 `By`를 붙인다.
                - 다른 테이블의 대한 조건 시 마지막에 `With`를 붙인다.

- **클래스명**
    1. 해당 클래스명은 맨 앞에 대문자를 사용한다.
    2. (사용하려는 기능명 + 상위 패키지명)을 사용한다.


## 🔗 ERD

---
![GOOUT-3](https://github.com/user-attachments/assets/ca2e1b09-7339-4ed3-9217-6163c1a1bd8e)


## ♻ CI/CD

---
![hangmancicd drawio](https://github.com/new-writon/Writon-Be/assets/106163272/341ed4ee-8d58-4be4-9c9a-6e229977a4a0)


## ⚙️ System Architecture

---

![goout achitecture drawio-3](https://github.com/user-attachments/assets/38629628-d5ea-4f82-9c44-607996218e82)

