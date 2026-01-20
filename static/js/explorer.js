  // Placeholder data - will be replaced with API calls
  const emojis = ['😀', '😢', '😡', '😱', '😴', '🤔', '😍', '🤮'];
  const participants = [
    { id: 'P001', name: 'Participant 001' },
    { id: 'P002', name: 'Participant 002' },
    { id: 'P003', name: 'Participant 003' },
  ];
  
  let selectedEmoji = null;
  let selectedParticipant = null;
  
  // Initialize emoji grid
  function initEmojis() {
    const grid = document.getElementById('emojiGrid');
    emojis.forEach(emoji => {
      const div = document.createElement('div');
      div.className = 'emoji-item';
      div.textContent = emoji;
      div.onclick = () => selectEmoji(emoji, div);
      grid.appendChild(div);
    });
  }
  
  // Initialize participant grid
  function initParticipants() {
    const grid = document.getElementById('participantGrid');
    participants.forEach(p => {
      const div = document.createElement('div');
      div.className = 'participant-item';
      div.innerHTML = `
        <div class="participant-img"></div>
        <div class="participant-id">${p.id}</div>
      `;
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
    initEmojis();
    initParticipants();
  });