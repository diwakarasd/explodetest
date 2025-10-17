(function() {
  // Create container div
  var popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.left = '20px';
  popup.style.width = '300px';
  popup.style.height = '170px';
  popup.style.borderRadius = '12px';
  popup.style.overflow = 'hidden';
  popup.style.zIndex = '9999';
  popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  
  // Create video element
  var video = document.createElement('video');
  video.src = 'https://www.w3schools.com/html/mov_bbb.mp4'; // replace with your video URL
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.style.width = '100%';
  video.style.height = '100%';
  video.style.objectFit = 'cover';

  // Add video to container
  popup.appendChild(video);

  // Optional: add close button
  var closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '5px';
  closeBtn.style.right = '10px';
  closeBtn.style.color = '#fff';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = function() {
    popup.style.display = 'none';
  };
  popup.appendChild(closeBtn);

  // Add popup to body
  document.body.appendChild(popup);
})();
