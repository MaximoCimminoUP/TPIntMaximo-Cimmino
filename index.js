$(document).ready(function() {
  // Function to fetch all users from the database
  function fetchUsers() {
    $.get('/usuarios', function(data) {
      var usersList = '';
      $.each(data, function(index, user) {
        usersList += '<li>ID: ' + user.id + ', Nombre: ' + user.nombre + ', Email: ' + user.email + '</li>';
      });
      $('#user-list').html(usersList);
    });
  }

  // Function to add a new user
  function addUser() {
    var nombre = $('#nombre').val();
    var email = $('#email').val();
    $.post('/usuarios', { nombre: nombre, email: email }, function(data) {
      alert(data);
      fetchUsers();
    });
  }

  // Function to update a user
  function updateUser() {
    var id = $('#id').val();
    var nombre = $('#nombre').val();
    var email = $('#email').val();
    $.ajax({
      url: '/usuarios/' + id,
      type: 'PUT',
      data: { nombre: nombre, email: email },
      success: function(data) {
        alert(data);
        fetchUsers();
      }
    });
  }

  // Function to delete a user
  function deleteUser() {
    var id = $('#id').val();
    $.ajax({
      url: '/usuarios/' + id,
      type: 'DELETE',
      success: function(data) {
        alert(data);
        fetchUsers();
      }
    });
  }

  // Fetch all users when the page loads
  fetchUsers();

  // Event handler for the "Add User" button
  $('#add-user').click(function() {
    addUser();
  });

  // Event handler for the "Update User" button
  $('#update-user').click(function() {
    updateUser();
  });

  // Event handler for the "Delete User" button
  $('#delete-user').click(function() {
    deleteUser();
  });
});