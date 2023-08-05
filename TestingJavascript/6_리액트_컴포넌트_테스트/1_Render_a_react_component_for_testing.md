# 테스트를 위해 리액트 컴포넌트 렌더링

## 테스트 대상 컴포넌트

파일 : `react-testing-library-course/src/favorite-number.js`

`FavoriteNumber` 컴포넌트는 `<label htmlFor="forvorite-number">`와 `<input type="number">`를 렌더링한다.

## 테스트 작성

파일 : `react-testing-library-course/__tests__/react-dom.js`

아주 간단한 테스트 케이스를 작성한다.

1. `import React`, `import ReactDOM`, 렌더링할 컴포넌트를 가져온다.
2. `<div>`를 생성하여 내부에 컴포넌트를 렌더링한다.
   - `ReactDOM.render(<FavoriteNumber />, div)`
3. `<div>`와 `querySelector`를 사용해 렌더링된 컴포넌트에 대한 어설션을 생성할 수 있다.
