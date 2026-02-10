export function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(`${position.coords.latitude},${position.coords.longitude}`);
      },
      (error) => {
        reject(error);
      },
    );
  });
}
