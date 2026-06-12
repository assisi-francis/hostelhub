function checkAuth() {
  if (!localStorage.getItem('user')) {
    window.location.replace('../../index.html');
  }
}

checkAuth();

window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    checkAuth();
  }
});
