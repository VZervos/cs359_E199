$(document).ready(async () => {
    const sound = new Audio('/E199_war_exploded/media/beedosound.mp3');
    let isPlaying = false;

    document.body.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying)
            sound.play().catch(error => console.error("Error playing sound:", error));
        else {
            sound.pause();
            sound.currentTime = 0;
        }
    });
});