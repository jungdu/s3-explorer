# S3-Explorer
AWS의 S3 버킷에 접근하여 파일 리스트를 조회하며, 
여러 파일을 한 번에 조작할 수 있는 편의성을 제공하는 Desktop Application 입니다.

## 사용된 주요 라이브러리
- electron
- react
- mobx
- aws-sdk

## 폴더구조
```
src
 ┣ main
 ┗ renderer: react-renderer 의해서 컴파일
   ┣ components: 컴포넌트
   ┣ context: store의 Provider, useContext 위치
   ┣ stores: mobX store
   ┣ types: 전역적으로 사용할 타입 정의
   ┣ utils
   ┃ ┣ aws: AWS-SDK 활용
   ┗ index.tsx: React root 컴포넌트
configs: webpack 설정
.storybook: storybook 설정
.env: 환경 변수
 ```

 ## 환경 변수 설정
.env 파일에 아래와 같이 Default 키 설정을 할 수 있습니다.<br/>
 ```
DEFAULT_ACCESS_KEY_ID=AKIsDf2...
DEFAULT_SECRET_ACCESS_KEY=pb1nsSIEe2...
 ```
Default 키 설정을 하게되면 App 실행 시 마다 키를 입력해야하는 번거로움을 줄일 수 있고,<br/>
Default 키로 테스트를 진행할 수 있습니다.
