// js/player.js

const audio = new Audio();
let currentTrackIndex = -1;

const tracks = [
  { title: "Track 1", artist: "Artist A", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", cover: "https://via.placeholder.com/100" },
  { title: "Track 2", artist: "Artist B", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", cover: "https://via.placeholder.com/100" },
  { title: "Track 3", artist: "Artist C", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", cover: "https://via.placeholder.com/100" }
];

function playTrack(index) {
  currentTrackIndex = index;
  const t = tracks[index];
  audio.src = t.url;
  audio.play();
  updatePlayerBar();
}

function prevTrack() {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1);
  }
}

function nextTrack() {
  if (currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  }
}

function updatePlayerBar() {
  const bar = document.getElementById('player-bar-now');
  if (currentTrackIndex >= 0) {
    const t = tracks[currentTrackIndex];
    bar.innerText = `${t.title} — ${t.artist}`;
  } else {
    bar.innerText = "Chưa chọn bài nào";
  }
}

// Khi trang load, nạp sự kiện nút
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('btn-prev').onclick = prevTrack;
  document.getElementById('btn-next').onclick = nextTrack;
});
