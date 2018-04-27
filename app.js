var vue = new Vue({
  el: '#app',
  data:{
    status: 'signup',
    newUser: {
      name: '',
      surname: '',
      email: '',
      password: ''
    },
    currentUser: null,
    currentChat: null,
    errorMessage: null,
    newChat: {
       name:''
    },
    chats: [],
    textOfComment: '',
    users: []
  },
  methods:{
      signup: function() {
          this.errorMessage = null;
          this.$http.post('http://localhost:3001/signup', this.newUser)
          .then(function(response){
            console.log("response:", response)
          })
          .catch(function(err){
            this.errorMessage = err.body.message;
            console.log(err);
          })
      },
      login: function() {
          this.errorMessage = null;
          this.$http.post('http://localhost:3001/login', {email: this.newUser.email, password: this.newUser.password})
          .then(function(response){
              localStorage.setItem('token', response.body.token);
              this.me();
          })
          .catch(function(err){
            this.errorMessage = err.body.message;
            console.log(err);
          })
      },
      logout: function() {
          this.currentUser = null;
          localStorage.removeItem('token');
      },
      me: function() {
          this.$http.get(`http://localhost:3001/me?token=${localStorage.getItem('token')}`)
          .then(function(response){
            console.log("response:", response);
            this.currentUser = response.body;
          })
      },
      createChat: function() {
          this.$http.post(`http://localhost:3001/chats?token=${localStorage.getItem('token')}`, this.newChat)
          .then(function(response){
            console.log("response:", response);
            this.newChat.name = '';
            this.getAllChats();
          })
      },
      getAllChats: function() {
          this.$http.get(`http://localhost:3001/chats?token=${localStorage.getItem('token')}`)
          .then(function(response){
              console.log("response:", response);
              this.chats = response.body;
          })
      },
      openChat: function(chat) {
          this.$http.get(`http://localhost:3001/chats/${chat._id}?token=${localStorage.getItem('token')}`)
          .then(function(response){
              this.currentChat = response.body;
          })
      },
      sendComment: function() {
          this.$http.post(`http://localhost:3001/chats/${this.currentChat._id}/send?token=${localStorage.getItem('token')}`, {text: this.textOfComment})
          .then(function(response){
              this.textOfComment = '';
              this.openChat(this.currentChat);
          })
      },
      getAllUsers: function() {
          this.$http.get(`http://localhost:3001/users?token=${localStorage.getItem('token')}`)
          .then(function(response){
              this.users = response.body;
          })
      },
      invite: function(userId) {
          this.$http.put(`http://localhost:3001/chats/${this.currentChat._id}/add?token=${localStorage.getItem('token')}`, {userId: userId})
          .then(function(response){
              console.log("response:", response);
          })
      }

  },
  created(){
      if (localStorage.getItem('token')) {
        this.me();
        this.getAllChats();
        this.getAllUsers();
        setInterval( () => {
            if (this.currentChat) {
              this.openChat(this.currentChat)
            }
        }, 1000);

      }
  }
})
