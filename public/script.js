$(document).ready(function() {
   $.getScript("../socket.io/socket.io.js", function() {
      var socket = io();
      socket.on("chat", addChat);

      var messagesHeight = $(window).height() - $("#sendForm").outerHeight(true) - $(".topHeader").outerHeight(true);
      $("#messages").css("height", `${messagesHeight}`);

      function scrollMessages() {
         //Check if it's needed to scroll down the 'messages' box due to overflow (so that we can see the last message sent)
         if (messagesHeight < $("#messages").prop("scrollHeight")) {
            $("#messages").scrollTop(($("#messages").prop("scrollHeight") - messagesHeight));
         }
      }

      //When page loads run this function
      scrollMessages();

      function addChat(newMessage) {
         console.log("function addChat(newMessage): " + newMessage);
         if ($(".loggedInAs > span").text() === newMessage.username) {
            $("#messages").append(`<li class="msg myMsg">${newMessage.message}</li>`);
         }
         else {
            $("#messages").append(`<li class="msg theirMsg"><h5 style="color: ${newMessage.userColor}">${newMessage.username}</h5>${newMessage.message}</li>`);
         }

         scrollMessages()
      }

      //Calculate and set the height of the messages box and the position of the input when resizing
      // or changing orientation on a smartphone or tablet
      $(window).resize(() => {
         messagesHeight = $(window).height() - $("#sendForm").outerHeight(true) - $(".topHeader").outerHeight(true);

         $("#messages").css("height", `${messagesHeight}`);
         $("#sendForm").css("bottom", "0");

         scrollMessages()
      });

      //Toggle between showing the login or register form
      function toggleLoginRegister() {
         $(".loginModal").toggleClass("hideModal");
         $(".registerModal").toggleClass("hideModal");
      }

      function displayMenu() {
         $(".displayMenu").toggleClass("showMenu");
      }

      //Send the message
      $("#sendForm").submit(function(e) {
         //If the message is empty do not continue
         if ($("#messageInput").val() == "") {
            return false;
         }


         var chatMessage = {
            username: $(".loggedInAs > span").text(),
            message: $("#messageInput").val()
         };
         $("#messageInput").val("");


         function postChat(chat) {
            $.post("https://chatapp-victorac.herokuapp.com/", chat);
         }

         postChat(chatMessage);

         e.preventDefault();
      });

      //Listen for events
      $("#linkToRegister").on("click", toggleLoginRegister);
      $("#linkToLogin").on("click", toggleLoginRegister);
      $(".menu").on("click", displayMenu);
      $(".closeModal").on("click", displayMenu);

   });

});
