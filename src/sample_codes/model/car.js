function Car() { /* ... */ };
Car.prototype.drive = function() { /* ... */ };
Car.prototype.play = function() {
  this.drive();
};

function Sagawa() { /* ... */ }
util.inherits(Sagawa, Car);
Sagawa.prototype.play = function() {
  this.tel();
  this.drive();
};
