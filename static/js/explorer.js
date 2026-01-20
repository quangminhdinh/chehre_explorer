let server_uri = "https://chehre-server.onrender.com";

let emojis = [];

async function loadEmojis() {
  const res = await fetch(`${server_uri}/all-emojis`);
  const paths = await res.json();

  emojis = paths.map(path => {
    const file = path.split('/').pop();      // 1f608.png
    const id = file.replace('.png', '');     // 1f608
    return {
      id,
      url: `${server_uri}${path}`
    };
  });

  initEmojis();
}


// const participants = [
//   { id: 'P001', name: 'Participant 001' },
//   { id: 'P002', name: 'Participant 002' },
//   { id: 'P003', name: 'Participant 003' },
// ];

let participants = [];

async function loadParticipants() {
  const res = await fetch(`${server_uri}/all-participants`);
  const paths = await res.json();

  participants = paths.map(path => {
    const file = path.split('/').pop();        // subj042.png
    const id = file.replace('.png', '');       // subj042
    return {
      id,
      url: `${server_uri}${path}`
    };
  });

  initParticipants();
}

let selectedEmoji = null;
let selectedParticipant = null;

// Initialize emoji grid
function initEmojis() {
  const grid = document.getElementById('emojiGrid');
  grid.innerHTML = '';

  emojis.forEach(e => {
    const div = document.createElement('div');
    div.className = 'emoji-item';

    const img = document.createElement('img');
    img.src = e.url;
    img.alt = e.id;
    img.className = 'emoji-img';

    div.appendChild(img);
    div.onclick = () => selectEmoji(e.id, div);

    grid.appendChild(div);
  });
}

// Initialize participant grid
function initParticipants() {
  const grid = document.getElementById('participantGrid');
  grid.innerHTML = '';

  participants.forEach(p => {
    const div = document.createElement('div');
    div.className = 'participant-item';

    const img = document.createElement('img');
    img.src = p.url;
    img.alt = p.id;
    img.className = 'participant-img';

    const label = document.createElement('div');
    label.className = 'participant-id';
    label.textContent = p.id;

    div.appendChild(img);
    div.appendChild(label);

    div.onclick = () => selectParticipant(p.id, div);

    grid.appendChild(div);
  });
}

// Select emoji
function selectEmoji(emoji, element) {
  document.querySelectorAll('.emoji-item').forEach(e => e.classList.remove('selected'));
  element.classList.add('selected');
  selectedEmoji = emoji;
  updateResults();
}

// Select participant
function selectParticipant(id, element) {
  document.querySelectorAll('.participant-item').forEach(e => e.classList.remove('selected'));
  element.classList.add('selected');
  selectedParticipant = id;
  updateResults();
}

// Update video results
function updateResults() {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = '';
  
  if (!selectedEmoji || !selectedParticipant) {
    return;
  }
  
  // Placeholder: Generate 3 sample videos
  for (let i = 1; i <= 3; i++) {
    const card = document.createElement('div');
    card.className = 'video-card';
    
    // Sample emotion data
    const emotions = {
      'Angry': Math.floor(Math.random() * 4),
      'Annoyed': Math.floor(Math.random() * 4),
      'Frustrated': Math.floor(Math.random() * 4),
      'Furious': Math.floor(Math.random() * 4)
    };
    
    const maxValue = 3;
    
    card.innerHTML = `
      <div class="video-placeholder">
        <video autoplay loop muted style="width: 100%; height: 100%; object-fit: cover;">
          <source src="placeholder.mp4" type="video/mp4">
          Video ${i}
        </video>
      </div>
      <div class="video-info">
        <strong>Video:</strong> ${selectedParticipant}_${selectedEmoji}_${i}.mp4<br>
        <strong>Rank 1:</strong> ${Object.keys(emotions)[0]} | <strong>Rank 2:</strong> ${Object.keys(emotions)[1]}
      </div>
      <div class="emotion-stats">
        ${Object.entries(emotions).map(([emotion, value]) => `
          <div class="emotion-row">
            <div class="emotion-label">${emotion}:</div>
            <div class="emotion-bar">
              <div class="emotion-fill" style="width: ${(value / maxValue) * 100}%"></div>
            </div>
            <div class="emotion-value">${value}</div>
          </div>
        `).join('')}
      </div>
    `;
    
    grid.appendChild(card);
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  loadEmojis();
  loadParticipants();
});