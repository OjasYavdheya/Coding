const mic = document.getElementById('mic');
const status = document.getElementById('status');

let isRecording = false;

mic.addEventListener('click', () => {
  isRecording = !isRecording;
  if (isRecording) {
    mic.classList.add('active');
    status.textContent = 'Recording...';
  } else {
    mic.classList.remove('active');
    status.textContent = 'Press the mic to start recording';
  }
});
