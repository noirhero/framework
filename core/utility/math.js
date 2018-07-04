function RandomRanged(min, max) {
  return Math.random() * (max - min) + min;
}

function Clamp(value, min, max) {
  value = (value <= min) ? min :
          (value >= max) ? max : value;
  return value;
}