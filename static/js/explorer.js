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
async function updateResults() {
  const grid = document.getElementById('videoGrid');
  grid.innerHTML = '';
  
  if (!selectedEmoji || !selectedParticipant) {
    grid.innerHTML = `
      <div class="empty-state">
        Select an emoji and participant to view results
      </div>
    `;
    return;
  }

  const url = new URL(
    `${server_uri}/get-videos-with-emotion-rankings`
  );

  url.searchParams.set('emoji_code', selectedEmoji);
  url.searchParams.set('participant_code', selectedParticipant);
  
  let data;
  try {
    const res = await fetch(url);
    data = await res.json();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Failed to load videos</div>`;
    return;
  }

  const entries = Object.entries(data);

  if (entries.length === 0) {
    grid.innerHTML = `<div class="empty-state">No matching videos</div>`;
    return;
  }

  entries.forEach(([videoPath, emotionCounts]) => {
    const card = document.createElement('div');
    card.className = 'video-card';

    const videoUrl = `${server_uri}${videoPath}`;
    const videoName = videoPath.split('/').pop();

    const maxValue = Object.values(emotionCounts).reduce((sum, v) => sum + v, 0);

    const sortedEmotions = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1]);

    const rank1 = sortedEmotions[0]?.[0] ?? 'N/A';
    const rank2 = sortedEmotions[1]?.[0] ?? 'N/A';

    card.innerHTML = `
      <div class="video-placeholder">
        <video controls preload="metadata">
          <source src="${videoUrl}" type="video/mp4">
        </video>
      </div>

      <div class="video-info">
        <strong>Video:</strong> ${videoName}<br>
        <strong>Rank 1:</strong> ${rank1} |
        <strong>Rank 2:</strong> ${rank2}
      </div>

      <div class="emotion-stats">
        ${sortedEmotions.map(([emotion, value]) => `
          <div class="emotion-row">
            <div class="emotion-label">${emotion}</div>
            <div class="emotion-bar">
              <div class="emotion-fill"
                   style="width: ${(value / maxValue) * 100}%">
              </div>
            </div>
            <div class="emotion-value">${value}</div>
          </div>
        `).join('')}
      </div>
    `;

    grid.appendChild(card);
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  loadEmojis();
  loadParticipants();
});
