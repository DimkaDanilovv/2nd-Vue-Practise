let eventBus = new Vue()
Vue.component("list", {
    template: `
    <div class="board">
    <ul  id="columns">
    <div class="form">
<form @submit.prevent="onSubmit">
    <label for="name">Заголовок</label>
    <input type="text" id="name" v-model="name">

    <label for="point1">1</label> 
    <input type="text" id="point1" v-model="point1">

    <label for="point2">2</label>
    <input type="text" id="point2" v-model="point2">

    <label for="point3">3</label>
    <input type="text" id="point3" v-model="point3">

    <label for="point4">4</label>
    <input type="text" id="point4" v-model="point4">

    <label for="point5">5</label>
    <input type="text" id="point5" v-model="point5">

<button type="submit" value="Submit">Создать</button>
</form>

<ul>
    <li class="error "v-for="error in errors">{{error}}</li>
</ul>
</div>
    <li  class="column">

    <ul class="cards">
        <li v-for="card in column1"><card :name="card.name" :column=1 :block="blockOne" :card_id="card.card_id" :count_of_checked="card.count_of_checked" :points="card.points" @to-two="toColumnTwo" >   </card></li>
    </ul>
</li>

<li class="column">
    <ul>
        <li  v-for="card in column2"><card :name="card.name" :column=2 :block=false :card_id="card.card_id" :count_of_checked="card.count_of_checked" :points="card.points" @to-three="toColumnThree" @to-one="toColumnOne" >  ></card></li>
    </ul>
</li>

<li class="column">
    <ul>
        <li  v-for="card in column3"><card class="done_card" :name="card.name" :pblock=true :dat="card.dat" :column=3 :points="card.points" ></card></li>
    </ul>
</li>

</ul>
</div>
    `,
    data() {
        return{
            column1:[],
            column2:[],
            column3:[],

            allColumns:[],
            cards:[],

            name:null,
            point1:null,
            point2:null,
            point3:null,
            point4:null,
            point5:null,

            points:[],
            errors:[],
            card_id:0,
            blockOne:false,

        }

    },
    mounted(){
        if (localStorage.getItem('allColumns')) {
              try {
                this.allColumns = JSON.parse(localStorage.getItem('allColumns'));
                this.column1 = this.allColumns[0]
                this.column2 = this.allColumns[1]
                this.column3 = this.allColumns[2]
                this.blockOne = this.allColumns[3]
              } catch(e) {
                localStorage.removeItem('allColumns');
              }
        }
},
watch:{
    column1(){
          this.allColumns = [this.column1,this.column2,this.column3, this.blockOne]
          const parsed = JSON.stringify(this.allColumns);
          localStorage.setItem('allColumns', parsed);
    },
    column2(){
          allColumns = [this.column1, this.column2, this.column3, this.blockOne]
          const parsed = JSON.stringify(this.allColumns);
          localStorage.setItem('allColumns', parsed);
    },
    column3(){
          allColumns = [this.column1, this.column2, this.column3, this.blockOne]
          const parsed = JSON.stringify(this.allColumns);
          localStorage.setItem('allColumns', parsed);
    },
},
methods:{
    onSubmit() {
        this.errors = [];
        this.points = [];
    
        if (this.point1) this.points.push([this.point1, false]);
        if (this.point2) this.points.push([this.point2, false]);
        if (this.point3) this.points.push([this.point3, false]);
        if (this.point4) this.points.push([this.point4, false]);
        if (this.point5) this.points.push([this.point5, false]);
    
        if (this.points.length < 3) this.errors.push("Должно быть заполнено от 3 пунктов");
        if (!this.name) this.errors.push("Не введён заголовок");
        if (this.column1.length >= 3) this.errors.push("Достигнуто максимальное число карточек");
        if (this.blockOne) this.errors.push("Второй столбец заполнен");
    
        if (this.errors.length === 0) {
            let info = {
                name: this.name,
                points: this.points,
                card_id: this.card_id,
                count_of_checked: 0,
            };
            this.card_id += 1;
            this.column1.push(info);
        }
    },
    toColumnOne(name, points, card_id, count_of_checked) {
        if (this.column1.length < 3) {
            let info = {
                name: name,
                points: points,
                card_id: card_id,
                count_of_checked: count_of_checked
            };
    
            for (let i = 0; i < this.column2.length; i++) {
                if (this.column2[i].card_id === card_id) {
                    this.column2.splice(i, 1);
                    break;
                }
            }
    
            this.column1.push(info);
        }
    },
    toColumnTwo(name, points, card_id, count_of_checked) {
        if (this.column2.length === 5) {
            this.blockOne = true;
        } else {
            let info = {
                name: name,
                points: points,
                card_id: card_id,
                count_of_checked: count_of_checked
            };
    
            for (let i = 0; i < this.column1.length; i++) {
                if (this.column1[i].card_id === card_id) {
                    this.column1.splice(i, 1);
                    break;
                }
            }
    
            this.column2.push(info);
        }
    
        let checks = 1;
        eventBus.$emit('checkTwo', checks);
    },
    toColumnThree(name,points, card_id,now){
        let info = {
            name:name,
            points:points,
            card_id:card_id,
            dat:now,
        }
        for(i in this.column2){
            
            if(this.column2[i].card_id==card_id){
                this.column2.splice(i, 1)
                break
            }
        }

        this.column3.push(info)
        this.blockOne =false;
        let checks = 1;
        eventBus.$emit('checkOne',checks)
    },
}
});

Vue.component("card", {
    template: `
<div class="card">
    <h3>{{name}}</h3>
    <ul>
        <li v-for="point in points"><task :block="block" :point="point[0]" :pblock="pblock" :done="point[1]" @checked="updatechecked" @updatetwo="updatetwo"></task></li>
    </ul>
    <p>{{dat}}</p>
</div>
    `,
    data() {
        return{
        }
    },
})
 
let app = new Vue({
    el: "#app",
    data: {
    },
    methods: {

    },
});