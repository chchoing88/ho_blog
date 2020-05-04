---
title: GraphQL Server
date: "2020-05-03T10:00:03.284Z"
tags:
  - javascript
  - GraphQL
keywords: 
  - GraphQL
---

## 개요

Rest API의 호출 형식 말고도 GraphQL을 사용하면 더 코드가 직관적이고 적은 요청으로 원하는 데이터만 가져올 수 있다는 장점을 듣고 GrpahQL Server 학습을 듣고 정리를 해봅니다.

그럼 먼저 Rest API와 GraphQL의 장.단점 부터 알아봅시다.

### Rest API 장점

메서도의 URI를 조합해서, 예측 가능하고 일정한 정보와 작업을 요청하는 것입니다.
각 요청이 어떤 동작이나 정보를 위한 것인지를 그 요청의 모습 자체로 추론 가능하다는 것입니다.
자원을 구조와 함께 나타내는 이런 형태의 구분자를 URI라고 합니다.

### Rest API 단점

전송되는 데이터의 양 측면에서 소모가 클것입니다.

### GraphQL 장점

내가 원하는 것만 골라서 요청할 수 있습니다.
필요한 정보를 얻기 위해서 Rest API는 여러번의 요청을 보내야할 수 도 있습니다.
하지만 GraphAPI는 다른 depth의 정보들이 한번에 다 와줄 수 있습니다.

백엔드 서버 하나에 Rest API 와 GraphAPI을 둘 다 구현해놓으면 사용자들이 골라서 사용할 수 있습니다.

### GraphQL 단점

받아야 하는 항목이 많고 딱 정해진 데이터 들을 받아와야 할때에는 쿼리에 일일이 나열하는 것 보다 그냥 URL 한줄 호출하는게 더 심플 할때가 있습니다.

> 참고 : Schema 란 데이터의 구조나 표현법, 관계를 나타내는 말입니다.

## 구현

먼저 GraphQL 쿼리의 요청을 받고 그에 해당하는 응답을 내보내줄 서버가 필요합니다.
이 서버는 [GraphQL Yoga](https://github.com/prisma-labs/graphql-yoga) 라는 것으로 만들어 볼 것이며, 
이는 GraphQL 서버를 아주 빠르게 시작할 수 있게 도와줍니다.

### 서버 index

```javascript
import { GraphQLServer } from "graphql-yoga";
import resolvers from "./graphql/apiResolver";

// Query는 네가 정보를 받을 때만 쓰입니다.
// Mutation은 네가 정보를 변형할 때 쓰입니다.

const server = new GraphQLServer({
  typeDefs: "graphql/apiSchema.graphql", // 스키마 정의
  resolvers, // resolvers 정의
});

server.start(() => console.log("Graphql Server Running hou!!!"));
```

### 스키마

스키마에서는 나의 데이터가 어떻게 보일지를 정의하는 공간입니다. 또는 데이터를 받거나 줄 정보에 대한 설명이라고 생각하면 됩니다.

```graphql
type Movie {
  id: Int!
  title: String!
  rating: Float
  description_intro: String
  language: String
  medium_cover_image: String
  genres: [String]
}

type Query {
  movies(limit: Int, rating: Float): [Movie]!
  movie(id: Int!): Movie
  suggestions(id: Int!): [Movie]!
}
```

### resolvers

스키마에서 너의 데이터가 어떻게 보일지를 정의하고 그 질문을 resolve에서 해결하는 함수를 만드는 것입니다.
`resolvers`는 다른 API에 갈 수도 있고 Database에 갈 수도 있습니다.

실제로 이름 Query의 기능성을 프로그래밍 해야합니다.
이 Query 들을 어떤 방식으로 resolve(해결) 해야 한다. 라는 느낌입니다.

```javascript
import { getMovies, getMovie, getSuggestions } from "./apidb";

const resolvers = {
  Query: {
    movies: (_, { rating, limit }) => getMovies(limit, rating),
    movie: (_, { id }) => getMovie(id),
    suggestions: (_, { id }) => getSuggestions(id),
  },
};

export default resolvers;
```

### DB

여기서 DB는 API를 요청하는 공간으로 마련해 두었습니다.

```javascript
import axios from "axios";
const BASE_URL = "https://yts-proxy.now.sh/";
const LIST_MOVIES_URL = `${BASE_URL}list_movies.json`;
const MOVIE_DETAILS_URL = `${BASE_URL}movie_details.json`;
const MOVIE_SUGGESTIONS_URL = `${BASE_URL}movie_suggestions.json`;

export const getMovies = async (limit, rating) => {
  const {
    data: {
      data: { movies },
    },
  } = await axios(LIST_MOVIES_URL, {
    params: {
      limit,
      minimum_rating: rating,
    },
  });
  return movies;
};

export const getMovie = async (id) => {
  const {
    data: {
      data: { movie },
    },
  } = await axios(MOVIE_DETAILS_URL, {
    params: {
      movie_id: id,
    },
  });
  return movie;
};

export const getSuggestions = async (id) => {
  const {
    data: {
      data: { movies },
    },
  } = await axios(MOVIE_SUGGESTIONS_URL, {
    params: {
      movie_id: id,
    },
  });
  return movies;
};
```

## 참고

- [노마드코더](https://academy.nomadcoders.co/courses/enrolled/357405)
- [https://www.youtube.com/watch?v=EkWI6Ru8lFQ&feature=emb_rel_pause](https://www.youtube.com/watch?v=EkWI6Ru8lFQ&feature=emb_rel_pause)