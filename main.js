const container = document.querySelector('.image-container');
const startButton = document.querySelector('.start-button');
const gameText = document.querySelector('.game-text');
const playeTime = document.querySelector('.play-time');

const tileCount = 16; //가로 4 * 세로 4 (타일개수)

let tiles = [];
const dragged = {
    el: null,
    class: null,
    index: null
}

let isPlaying = false; //타일 더이상 움직이지 않도록(드래그방지)
let timeInterval = null;
let time = 0;

//배열 인덱스와 속성으로 부여한 인덱스의 번호가 같을 땐 적합한 위치에 놓여있다 판단하여 게임을 종료하게 된다
//처음에는 정상적인 사진이 보이게 되고 일정 시간이 지나면 뒤섞인 이미지가 보이도록 함


//functions
function checkStatus(){
    const currentList = [...container.children];
    const unMatchedList = currentList.filter((child, index) => Number(child.getAttribute('data-index')) !== index); // filter(): 제시한 특정한 조건에 만족하는 element만 return 
    if(unMatchedList.length === 0){
        gameText.style.display = 'block';
        isPlaying = false;
        clearInterval(timeInterval);
    }
}

function setGame(){
    isPlaying = true;
    time = 0;
    container.innerHTML = ""; //컨테이너 초기화 -> start 버튼 누를 때마다 실행되도록 할 것이기 때문에 해 주는 것이 좋음
    gameText.style.display = 'none';
    clearInterval(timeInterval); // 실행 도중에 다시 실행할 수도 있기 때문

    timeInterval = setInterval(() => {
        playeTime.innerText = time;
        time++;
    }, 1000);

    tiles = createImageTiles();
    tiles.forEach( tile => container.appendChild(tile)) //처음 이미지가 보여지게 됨
    setTimeout(() => {
        container.innerHTML = "";
        shuffle(tiles).forEach( tile => container.appendChild(tile)) //타일이 랜덤하게 뒤섞여 보여지게 됨
    },2000)
}

//타일 자리 잡아주기
function createImageTiles() {
    const tempArray = [];
    Array(tileCount).fill().forEach( (_, i)=>{
        const li = document.createElement('li');
        li.setAttribute('date-index', i); //인덱스와 데이터타입의 숫자가 맞는지 확인해 자리 확인을 할 수 있도록 함
        li.setAttribute('draggable', 'true');
        li.classList.add(`list${i}`);
        tempArray.push(li);
    } ); 
    //인덱스는 있되 값이 들어있지 않은 배열 생성 arr.fill() 메서드
    //인덱스를 출력하는 forEach() 반복문
    return tempArray;
}

//타일 섞어주기
function shuffle(array) {
    let index = array.length - 1; //가장 마지막 인덱스 선택
    while (index>0){
        const randomIndex = Math.floor(Math.random()*(index+1)); //index+1 곱하는 과정 통해 유효한 인덱스 만들 수 있도록 한다
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]]; //위치switch
        index--; //제일 마지막 인덱스로부터 1씩 감소 (뒤에서부터 앞으로 돌아가는 형태)
    }
    return array; //순서가 뒤섞인 배열 return
}




// events
container.addEventListener('dragstart', e => {
    if(!isPlaying) return;
    const obj = e.target;
    dragged.el = obj;
    dragged.class = obj.className;
    dragged.index = [ ...obj.parentNode.children].indexOf(obj);
    //indexOf()는 배열 형태에서만 사용이 가능함 but dragged.index로 불러온 것은 object이기 때문에 배열로 바꾸어 주어야 한다
    //es6 문법 강좌 보기 -> es6 문법을 통해 배열로 바꾸어 주었다
})

container.addEventListener('dragover', e => {
    e.preventDefault();
})

container.addEventListener('drop', e => {
    if(!isPlaying) return;
    const obj = e.target;

    if(obj.className !== dragged.class){
        let originPlace;
        let isLast = false; //마지막 element인지 확인
    
        if(dragged.el.nextSibling){
            originPlace = dragged.el.nextSibling;
        } else {
            originPlace = dragged.el.previousSibling;
            isLast = true;
        }

        const droppedIndex = [ ...obj.parentNode.children].indexOf(obj);
        dragged.index > droppedIndex ? obj.before(dragged.el) : obj.after(dragged.el) //가져온 인덱스가 배열의 인덱스보다 크게 되면 obj.before 이용해 앞으로 넣음, 아니라면 after 통해 뒤에 넣어줌
        isLast ? originPlace.after(obj) : originPlace.before(obj); //drop된 것과 밀려난 타일을 바꿔줌 
    }
    checkStatus();
})

startButton.addEventListener('click', () => {
    setGame();

})