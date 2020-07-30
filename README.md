# Backend for Bug Bounty 
the project for Bug Bounty Platform

  
* **Coding Convention**  
> + common   
> a. indent는 4칸  
> b. 화면 ⅔ 지점 넘어가는 경우 코드개행  
> c. 함수시작 시 주석은 아랫줄에, 코드 덩어리 주석은 덩어리 윗줄에  
> d. Global variable, static variable 반드시 사전협의 후 사용.  
>
> 0) name  
>  a. 기본적으로 fullname 사용하지만 관습적으로 합의된 단축어 사용 가능  
>  		- e.g : show**Info**(), extract**PE**Size(), my**IP**, get**Int**From**Val** …   
> 
> 1) Function name  
>  a. 기본적으로 lowerCamelCase   
>  b. 기능이 어느정도 포함되도록 Verb + Noun의 구조로 명명   
>  b. 기본 prisma api와 Verb가 겹치지 않게 할것. (예를 들어, prisma에는 createUser() 함수가 이미 존재하므로 registerUser()와 같이 명명)  
> 
> 2) Variable name  
>  a. 기본적으로 lowerCamelCase   
>  b. 상수는 대문자 + 언더바   
> 
> 3) file name  
>  a. /src/api/ 하위 폴더들은 대문자로 시작하며, 기본적으로 UpperCamelCase 이다.   
>  b. /src/ 이하 폴더가 아닌 파일들은 소문자로 시작하며, 기본적으로 lowerCamelCase 이다.   
 
* * *

